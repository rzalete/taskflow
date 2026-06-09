import { api } from "../../lib/api"

export interface Team {
  id: number
  name: string
}

export interface CreateTeamPayload {
  name: string
}

export async function getTeams(): Promise<Team[]> {
  const { data } = await api.get<Team[]>("/teams")
  return data
}

export async function getTeam(teamId: number): Promise<Team> {
  const { data } = await api.get<Team>(`/teams/${teamId}`)
  return data
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  const { data } = await api.post<Team>("/teams", payload)
  return data
}
