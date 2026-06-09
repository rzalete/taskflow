import { api } from "../../lib/api"

export type Role = "owner" | "admin" | "member"

export interface Member {
  user_id: number
  email: string
  full_name: string
  role: Role
}

export interface MemberAdd {
  email: string
  role: Role
}

export async function getMembers(teamId: number): Promise<Member[]> {
  const { data } = await api.get<Member[]>(`/teams/${teamId}/members`)
  return data
}

export async function addMember(
  teamId: number,
  payload: MemberAdd,
): Promise<Member> {
  const { data } = await api.post<Member>(`/teams/${teamId}/members`, payload)
  return data
}

export async function updateMemberRole(
  teamId: number,
  userId: number,
  role: Role,
): Promise<Member> {
  const { data } = await api.patch<Member>(
    `/teams/${teamId}/members/${userId}`,
    { role },
  )
  return data
}

export async function removeMember(
  teamId: number,
  userId: number,
): Promise<void> {
  await api.delete(`/teams/${teamId}/members/${userId}`)
}
