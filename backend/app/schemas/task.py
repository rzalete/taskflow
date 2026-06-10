from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.backlog
    priority: TaskPriority = TaskPriority.medium
    due_date: date | None = None
    assignee_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: date | None = None
    assignee_id: int | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    due_date: date | None
    project_id: int
    assignee_id: int | None
    position: int


class TaskMove(BaseModel):
    status: TaskStatus
    position: int = Field(ge=0)
