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


settings = Settings()
