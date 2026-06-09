import { api } from "../../lib/api"

export interface Project {
  id: number
  name: string
  description: string | null
  team_id: number
}

export interface CreateProjectPayload {
  name: string
  description?: string
}

export async function getProjects(teamId: number): Promise<Project[]> {
  const { data } = await api.get<Project[]>(`/teams/${teamId}/projects`)
  return data
}

export async function getProject(
  teamId: number,
  projectId: number,
): Promise<Project> {
  const { data } = await api.get<Project>(
    `/teams/${teamId}/projects/${projectId}`,
  )
  return data
}

export async function createProject(
  teamId: number,
  payload: CreateProjectPayload,
): Promise<Project> {
  const { data } = await api.post<Project>(`/teams/${teamId}/projects`, payload)
  return data
}
