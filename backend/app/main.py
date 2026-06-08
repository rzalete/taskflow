from fastapi import FastAPI

from app.api.routes import auth, teams
from app.core.config import settings

app = FastAPI(title=settings.app_name)
app.include_router(auth.router)
app.include_router(teams.router)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
