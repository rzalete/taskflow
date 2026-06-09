import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  addMember,
  getMembers,
  removeMember,
  updateMemberRole,
  type MemberAdd,
  type Role,
} from "./membersApi"

export function useMembers(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => getMembers(teamId),
  })
}

export function useAddMember(teamId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MemberAdd) => addMember(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "members"] })
    },
  })
}

export function useUpdateMemberRole(teamId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: Role }) =>
      updateMemberRole(teamId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "members"] })
    },
  })
}

export function useRemoveMember(teamId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => removeMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", teamId, "members"] })
    },
  })
}
