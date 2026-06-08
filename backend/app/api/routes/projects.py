from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import CurrentMembership, DbSession, require_role
from app.models import Project, Role
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter(prefix="/teams/{team_id}/projects", tags=["projects"])


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


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    team_id: int,
    project_in: ProjectCreate,
    membership: CurrentMembership,
    db: DbSession,
) -> Project:
    require_role(membership, Role.owner, Role.admin)
    project = Project(
        name=project_in.name,
        description=project_in.description,
        team_id=team_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=list[ProjectRead])
def list_projects(
    team_id: int, membership: CurrentMembership, db: DbSession
) -> list[Project]:
    projects = db.scalars(select(Project).where(Project.team_id == team_id)).all()
    return list(projects)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    team_id: int,
    project_id: int,
    membership: CurrentMembership,
    db: DbSession,
) -> Project:
    return _get_project(db, team_id, project_id)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    team_id: int,
    project_id: int,
    project_in: ProjectUpdate,
    membership: CurrentMembership,
    db: DbSession,
) -> Project:
    require_role(membership, Role.owner, Role.admin)
    project = _get_project(db, team_id, project_id)
    data = project_in.model_dump(exclude_unset=True)
    if "name" in data:
        project.name = data["name"]
    if "description" in data:
        project.description = data["description"]
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    team_id: int,
    project_id: int,
    membership: CurrentMembership,
    db: DbSession,
) -> None:
    require_role(membership, Role.owner, Role.admin)
    project = _get_project(db, team_id, project_id)
    db.delete(project)
    db.commit()
