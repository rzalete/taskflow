import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import (
    Membership,
    Project,
    Role,
    Task,
    TaskPriority,
    TaskStatus,
    Team,
    User,
)


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


def test_project_belongs_to_team(db_session: Session) -> None:
    team = Team(name="Taskflow")
    db_session.add(team)
    db_session.flush()

    project = Project(name="Backend", team=team)
    db_session.add(project)
    db_session.commit()

    assert team.projects[0].name == "Backend"
    assert project.team.name == "Taskflow"


def test_task_defaults_and_relationships(db_session: Session) -> None:
    user = User(email="dev@example.com", hashed_password="x", full_name="Dev")
    team = Team(name="Taskflow")
    db_session.add_all([user, team])
    db_session.flush()

    project = Project(name="Backend", team=team)
    db_session.add(project)
    db_session.flush()

    task = Task(title="Set up auth", project=project, assignee=user)
    db_session.add(task)
    db_session.commit()

    assert task.status is TaskStatus.backlog
    assert task.priority is TaskPriority.medium
    assert task.due_date is None
    assert project.tasks[0].title == "Set up auth"
    assert user.assigned_tasks[0].project.name == "Backend"
