import { api } from "../../lib/api"

export type Role = "owner" | "admin" | "member"

export interface Member {
  user_id: number
  email: string
  full_name: string
  role: Role
}

export async function getMembers(teamId: number): Promise<Member[]> {
  const { data } = await api.get<Member[]>(`/teams/${teamId}/members`)
  return data
}
