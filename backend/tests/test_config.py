import pytest

from app.core.config import Settings


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (
            "postgres://u:p@host:5432/taskflow",
            "postgresql+psycopg://u:p@host:5432/taskflow",
        ),
        (
            "postgresql://u:p@host:5432/taskflow",
            "postgresql+psycopg://u:p@host:5432/taskflow",
        ),
        (
            "postgresql+psycopg://u:p@host:5432/taskflow",
            "postgresql+psycopg://u:p@host:5432/taskflow",
        ),
        ("sqlite:///./taskflow.db", "sqlite:///./taskflow.db"),
    ],
)
def test_database_url_normalized_to_psycopg(raw: str, expected: str) -> None:
    assert Settings(database_url=raw).database_url == expected
