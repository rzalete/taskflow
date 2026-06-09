import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createProject,
  getProjects,
  type CreateProjectPayload,
} from "./projectsApi"

export function useProjects(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "projects"],
    queryFn: () => getProjects(teamId),
  })
}

export function useCreateProject(teamId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      createProject(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "projects"],
      })
    },
  })
}
