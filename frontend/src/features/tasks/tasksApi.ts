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

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
}

export const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  low: "bg-well text-ink-muted",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}

export const STATUS_STYLES: Record<TaskStatus, string> = {
  backlog: "bg-well text-ink-muted",
  todo: "bg-well text-ink",
  in_progress: "bg-blue-100 text-blue-700",
  in_review: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
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
