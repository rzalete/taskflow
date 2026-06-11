from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Taskflow"
    environment: str = "development"
    debug: bool = True
    database_url: str = "sqlite:///./taskflow.db"

    # Auth / JWT
    secret_key: str = "dev-only-secret-change-me-in-production-please"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _assemble_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("database_url", mode="after")
    @classmethod
    def _use_psycopg_driver(cls, value: str) -> str:
        """Normalize a Postgres URL to the psycopg 3 driver.

        Managed hosts often inject ``postgres://`` or ``postgresql://``;
        SQLAlchemy 2.0 rejects the former outright and defaults the latter
        to psycopg2. Rewrite both to ``postgresql+psycopg://`` so deploys
        work unedited. SQLite and any already-qualified driver URL are left
        untouched.
        """
        if value.startswith("postgres://"):
            value = "postgresql://" + value[len("postgres://") :]
        if value.startswith("postgresql://"):
            value = "postgresql+psycopg://" + value[len("postgresql://") :]
        return value


settings = Settings()
