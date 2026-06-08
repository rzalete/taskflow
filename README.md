# Taskflow

> A full-stack project management system for individuals and small teams. Plan work, organize projects, and track progress on a clean task board.

**Status:** Early development

## Overview

Taskflow lets teams create projects and manage tasks with clear status tracking (To do → In progress → Done). It's built as a portfolio project to demonstrate professional, production-style engineering.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | FastAPI (Python), SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL (SQLite for local dev) |
| Auth | JWT (OAuth2 password flow) |
| Frontend | React + Vite + TypeScript |
| Testing | pytest, httpx |
| Tooling | ruff, black, mypy, pre-commit |
| CI/CD | GitHub Actions |

## Project Structure

```
taskflow/
├── backend/     # FastAPI application
├── frontend/    # React SPA (Vite + TypeScript)
└── .github/     # CI workflows
```

## Getting Started

> ⚠️ Setup instructions will be filled in as the backend and frontend are scaffolded.

```bash
git clone <your-repo-url>
cd taskflow
cp .env.example .env
```

## License

Released under the MIT License.
