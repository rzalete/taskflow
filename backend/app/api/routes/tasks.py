from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import CurrentMembership, DbSession, require_role
from app.models import Membership, Project, Role, Task, TaskStatus
from app.schemas.task import TaskCreate, TaskMove, TaskRead, TaskUpdate

router = APIRouter(
    prefix="/teams/{team_id}/projects/{project_id}/tasks", tags=["tasks"]
)


def _get_project(db: Session, team_id: int, project_id: int) -> Project:
    project = db.scalar(
        select(Project).where(
            Project.id == project_id,
            Project.team_id == team_id,
        )
    )
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return project


def _get_task(db: Session, project_id: int, task_id: int) -> Task:
    task = db.scalar(
        select(Task).where(
            Task.id == task_id,
            Task.project_id == project_id,
        )
    )
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


def _validate_assignee(db: Session, team_id: int, assignee_id: int) -> None:
    membership = db.scalar(
        select(Membership).where(
            Membership.team_id == team_id,
            Membership.user_id == assignee_id,
        )
    )
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignee must be a team member",
        )


def _reindex_column(
    db: Session,
    project_id: int,
    column_status: TaskStatus,
    moved_task: Task | None = None,
    position: int | None = None,
) -> None:
    """Rewrite a (project, status) column to a dense 0..n sequence.

    ``moved_task`` is always removed from the column first (by id), so the
    caller — not the query — controls its placement and we never depend on
    flush timing to decide whether it's still a member. Pass a ``position`` to
    re-insert it at that index (a move *into* this column); omit ``position``
    to just close the gap a task left behind (a move *out of* this column).
    """
    tasks = list(
        db.scalars(
            select(Task)
            .where(
                Task.project_id == project_id,
                Task.status == column_status,
            )
            .order_by(Task.position, Task.id)
        ).all()
    )
    if moved_task is not None:
        tasks = [t for t in tasks if t.id != moved_task.id]
        if position is not None:
            index = max(0, min(position, len(tasks)))
            tasks.insert(index, moved_task)
    for index, task in enumerate(tasks):
        task.position = index


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    team_id: int,
    project_id: int,
    task_in: TaskCreate,
    membership: CurrentMembership,
    db: DbSession,
) -> Task:
    _get_project(db, team_id, project_id)
    if task_in.assignee_id is not None:
        _validate_assignee(db, team_id, task_in.assignee_id)
    last_position = db.scalar(
        select(func.max(Task.position)).where(
            Task.project_id == project_id,
            Task.status == task_in.status,
        )
    )
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date,
        project_id=project_id,
        assignee_id=task_in.assignee_id,
        position=0 if last_position is None else last_position + 1,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("", response_model=list[TaskRead])
def list_tasks(
    team_id: int,
    project_id: int,
    membership: CurrentMembership,
    db: DbSession,
    status_filter: Annotated[TaskStatus | None, Query(alias="status")] = None,
    assignee_id: int | None = None,
) -> list[Task]:
    _get_project(db, team_id, project_id)
    query = select(Task).where(Task.project_id == project_id)
    if status_filter is not None:
        query = query.where(Task.status == status_filter)
    if assignee_id is not None:
        query = query.where(Task.assignee_id == assignee_id)
    query = query.order_by(Task.status, Task.position, Task.id)
    tasks = db.scalars(query).all()
    return list(tasks)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    team_id: int,
    project_id: int,
    task_id: int,
    membership: CurrentMembership,
    db: DbSession,
) -> Task:
    _get_project(db, team_id, project_id)
    return _get_task(db, project_id, task_id)


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    team_id: int,
    project_id: int,
    task_id: int,
    task_in: TaskUpdate,
    membership: CurrentMembership,
    db: DbSession,
) -> Task:
    _get_project(db, team_id, project_id)
    task = _get_task(db, project_id, task_id)
    data = task_in.model_dump(exclude_unset=True)
    if data.get("assignee_id") is not None:
        _validate_assignee(db, team_id, data["assignee_id"])
    for field, value in data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}/move", response_model=TaskRead)
def move_task(
    team_id: int,
    project_id: int,
    task_id: int,
    task_in: TaskMove,
    membership: CurrentMembership,
    db: DbSession,
) -> Task:
    _get_project(db, team_id, project_id)
    task = _get_task(db, project_id, task_id)
    source_status = task.status

    task.status = task_in.status
    # Flush the status change BEFORE re-indexing, so the column queries below
    # see this task in its destination column, not its old one. We don't rely
    # on implicit autoflush — this session may have it turned off.
    db.flush()
    # Re-index the destination column with the task slotted at the new index.
    _reindex_column(db, project_id, task_in.status, task, task_in.position)
    # If the card changed columns, close the gap it left behind.
    if source_status != task_in.status:
        _reindex_column(db, project_id, source_status, task)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    team_id: int,
    project_id: int,
    task_id: int,
    membership: CurrentMembership,
    db: DbSession,
) -> None:
    require_role(membership, Role.owner, Role.admin)
    _get_project(db, team_id, project_id)
    task = _get_task(db, project_id, task_id)
    db.delete(task)
    db.commit()
