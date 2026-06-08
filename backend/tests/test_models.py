import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Membership, Role, Team, User


def test_membership_links_user_and_team(db_session: Session) -> None:
    user = User(email="ali@example.com", hashed_password="x", full_name="Ali")
    team = Team(name="Taskflow")
    db_session.add_all([user, team])
    db_session.flush()

    db_session.add(Membership(user=user, team=team, role=Role.owner))
    db_session.commit()

    assert user.memberships[0].team.name == "Taskflow"
    assert user.memberships[0].role is Role.owner


def test_membership_is_unique_per_user_and_team(db_session: Session) -> None:
    user = User(email="a@example.com", hashed_password="x", full_name="A")
    team = Team(name="T")
    db_session.add_all([user, team])
    db_session.flush()

    db_session.add(Membership(user=user, team=team, role=Role.member))
    db_session.commit()

    db_session.add(Membership(user=user, team=team, role=Role.admin))
    with pytest.raises(IntegrityError):
        db_session.commit()
