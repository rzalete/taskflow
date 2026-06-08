from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import Membership, Role, User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DbSession,
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    subject = decode_access_token(token)
    if subject is None:
        raise credentials_exception
    try:
        user_id = int(subject)
    except ValueError:
        raise credentials_exception from None
    user = db.scalar(select(User).where(User.id == user_id))
    if user is None:
        raise credentials_exception
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_membership(
    team_id: int,
    current_user: CurrentUser,
    db: DbSession,
) -> Membership:
    membership = db.scalar(
        select(Membership).where(
            Membership.team_id == team_id,
            Membership.user_id == current_user.id,
        )
    )
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    return membership


CurrentMembership = Annotated[Membership, Depends(get_current_membership)]


def require_role(membership: Membership, *allowed: Role) -> None:
    if membership.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
