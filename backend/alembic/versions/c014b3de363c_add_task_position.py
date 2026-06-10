"""add task position

Revision ID: c014b3de363c
Revises: 1c41cb6192a7
Create Date: 2026-06-10 21:59:14.540718

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "c014b3de363c"
down_revision: Union[str, Sequence[str], None] = "1c41cb6192a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add the column with a temporary server-side default, so every existing
    #    row is valid the moment the column appears.
    op.add_column(
        "tasks",
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
    )

    # 2. Backfill a dense 0..n sequence within each (project_id, status) group,
    #    ordered by id so the existing visual order is preserved. This uses a
    #    lightweight table literal (not the ORM model) so the migration keeps
    #    working even if the Task model changes in a later PR.
    tasks = sa.table(
        "tasks",
        sa.column("id", sa.Integer),
        sa.column("project_id", sa.Integer),
        sa.column("status", sa.String),
        sa.column("position", sa.Integer),
    )
    bind = op.get_bind()
    rows = bind.execute(
        sa.select(tasks.c.id, tasks.c.project_id, tasks.c.status).order_by(
            tasks.c.project_id, tasks.c.status, tasks.c.id
        )
    ).all()
    counters: dict[tuple[int, str], int] = {}
    for row in rows:
        key = (row.project_id, row.status)
        index = counters.get(key, 0)
        bind.execute(tasks.update().where(tasks.c.id == row.id).values(position=index))
        counters[key] = index + 1

    # 3. Drop the temporary default now that every row has a real value, so it
    #    doesn't linger in the schema and cause autogenerate noise later (batch
    #    mode because SQLite rebuilds the table to alter a column).
    with op.batch_alter_table("tasks") as batch_op:
        batch_op.alter_column("position", server_default=None)


def downgrade() -> None:
    op.drop_column("tasks", "position")
