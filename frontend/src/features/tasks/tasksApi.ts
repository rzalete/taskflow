import { api } from "../../lib/api"

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  project_id: number
  assignee_id: number | null
  position: number
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  assignee_id?: number | null
}

export async function getTasks(
  teamId: number,
  projectId: number,
): Promise<Task[]> {
  const { data } = await api.get<Task[]>(
    `/teams/${teamId}/projects/${projectId}/tasks`,
  )
  return data
}

export async function createTask(
  teamId: number,
  projectId: number,
  payload: CreateTaskPayload,
): Promise<Task> {
  const { data } = await api.post<Task>(
    `/teams/${teamId}/projects/${projectId}/tasks`,
    payload,
  )
  return data
}

export async function updateTask(
  teamId: number,
  projectId: number,
  taskId: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const { data } = await api.patch<Task>(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}`,
    payload,
  )
  return data
}

export interface MoveTaskPayload {
  status: TaskStatus
  position: number
}

export async function moveTask(
  teamId: number,
  projectId: number,
  taskId: number,
  payload: MoveTaskPayload,
): Promise<Task> {
  const { data } = await api.patch<Task>(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/move`,
    payload,
  )
  return data
}

export async function deleteTask(
  teamId: number,
  projectId: number,
  taskId: number,
): Promise<void> {
  await api.delete(`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`)
}
