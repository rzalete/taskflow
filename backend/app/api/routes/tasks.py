from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import CurrentMembership, DbSession, require_role
from app.models import Membership, Project, Role, Task, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

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
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date,
        project_id=project_id,
        assignee_id=task_in.assignee_id,
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
