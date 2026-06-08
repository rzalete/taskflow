from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import (
    CurrentMembership,
    CurrentUser,
    DbSession,
    require_role,
)
from app.models import Membership, Role, Team
from app.schemas.team import TeamCreate, TeamRead, TeamUpdate

router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(team_in: TeamCreate, current_user: CurrentUser, db: DbSession) -> Team:
    team = Team(name=team_in.name)
    team.memberships.append(Membership(user=current_user, role=Role.owner))
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.get("", response_model=list[TeamRead])
def list_my_teams(current_user: CurrentUser, db: DbSession) -> list[Team]:
    teams = db.scalars(
        select(Team).join(Membership).where(Membership.user_id == current_user.id)
    ).all()
    return list(teams)


@router.get("/{team_id}", response_model=TeamRead)
def get_team(team_id: int, membership: CurrentMembership, db: DbSession) -> Team:
    team = db.get(Team, team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    return team


@router.patch("/{team_id}", response_model=TeamRead)
def update_team(
    team_id: int,
    team_in: TeamUpdate,
    membership: CurrentMembership,
    db: DbSession,
) -> Team:
    require_role(membership, Role.owner, Role.admin)
    team = db.get(Team, team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    if team_in.name is not None:
        team.name = team_in.name
    db.commit()
    db.refresh(team)
    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, membership: CurrentMembership, db: DbSession) -> None:
    require_role(membership, Role.owner)
    team = db.get(Team, team_id)
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    db.delete(team)
    db.commit()
