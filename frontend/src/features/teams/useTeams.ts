import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createTeam,
  getTeam,
  getTeams,
  type CreateTeamPayload,
} from "./teamsApi"

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: getTeams })
}

export function useTeam(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: () => getTeam(teamId),
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
    },
  })
}
