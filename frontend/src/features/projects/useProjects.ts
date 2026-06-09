import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createProject,
  getProjects,
  getProject,
  type CreateProjectPayload,
} from "./projectsApi"

export function useProjects(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "projects"],
    queryFn: () => getProjects(teamId),
  })
}

export function useProject(teamId: number, projectId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "projects", projectId],
    queryFn: () => getProject(teamId, projectId),
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
