from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import CurrentMembership, DbSession, require_role
from app.models import Membership, Role, User
from app.schemas.member import MemberAdd, MemberRead, MemberRoleUpdate

router = APIRouter(prefix="/teams/{team_id}/members", tags=["members"])


def _owner_count(db: Session, team_id: int) -> int:
    count = db.scalar(
        select(func.count())
        .select_from(Membership)
        .where(
            Membership.team_id == team_id,
            Membership.role == Role.owner,
        )
    )
    return int(count or 0)


@router.get("", response_model=list[MemberRead])
def list_members(
    team_id: int, membership: CurrentMembership, db: DbSession
) -> list[MemberRead]:
    memberships = db.scalars(
        select(Membership).where(Membership.team_id == team_id)
    ).all()
    return [
        MemberRead(
            user_id=m.user_id,
            email=m.user.email,
            full_name=m.user.full_name,
            role=m.role,
        )
        for m in memberships
    ]


@router.post("", response_model=MemberRead, status_code=status.HTTP_201_CREATED)
def add_member(
    team_id: int,
    member_in: MemberAdd,
    membership: CurrentMembership,
    db: DbSession,
) -> MemberRead:
    require_role(membership, Role.owner, Role.admin)
    if member_in.role == Role.owner and membership.role != Role.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an owner can grant the owner role",
        )
    user = db.scalar(select(User).where(User.email == member_in.email))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    existing = db.scalar(
        select(Membership).where(
            Membership.team_id == team_id,
            Membership.user_id == user.id,
        )
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member",
        )
    new_membership = Membership(team_id=team_id, user_id=user.id, role=member_in.role)
    db.add(new_membership)
    db.commit()
    return MemberRead(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=new_membership.role,
    )


@router.patch("/{user_id}", response_model=MemberRead)
def update_member_role(
    team_id: int,
    user_id: int,
    role_in: MemberRoleUpdate,
    membership: CurrentMembership,
    db: DbSession,
) -> MemberRead:
    require_role(membership, Role.owner, Role.admin)
    target = db.scalar(
        select(Membership).where(
            Membership.team_id == team_id,
            Membership.user_id == user_id,
        )
    )
    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )
    touches_owner = target.role == Role.owner or role_in.role == Role.owner
    if touches_owner and membership.role != Role.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an owner can manage owner roles",
        )
    if (
        target.role == Role.owner
        and role_in.role != Role.owner
        and _owner_count(db, team_id) == 1
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot demote the last owner",
        )
    target.role = role_in.role
    db.commit()
    return MemberRead(
        user_id=target.user_id,
        email=target.user.email,
        full_name=target.user.full_name,
        role=target.role,
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    team_id: int,
    user_id: int,
    membership: CurrentMembership,
    db: DbSession,
) -> None:
    require_role(membership, Role.owner, Role.admin)
    target = db.scalar(
        select(Membership).where(
            Membership.team_id == team_id,
            Membership.user_id == user_id,
        )
    )
    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )
    if target.role == Role.owner and membership.role != Role.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an owner can remove an owner",
        )
    if target.role == Role.owner and _owner_count(db, team_id) == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove the last owner",
        )
    db.delete(target)
    db.commit()
