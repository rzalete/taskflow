import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createTask,
  getTasks,
  updateTask,
  type CreateTaskPayload,
  type Task,
  type TaskStatus,
} from "./tasksApi"

function tasksKey(teamId: number, projectId: number) {
  return ["teams", teamId, "projects", projectId, "tasks"] as const
}

export function useTasks(teamId: number, projectId: number) {
  return useQuery({
    queryKey: tasksKey(teamId, projectId),
    queryFn: () => getTasks(teamId, projectId),
  })
}

export function useCreateTask(teamId: number, projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      createTask(teamId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(teamId, projectId) })
    },
  })
}

export function useMoveTask(teamId: number, projectId: number) {
  const queryClient = useQueryClient()
  const key = tasksKey(teamId, projectId)

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
      updateTask(teamId, projectId, taskId, { status }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Task[]>(key)
      queryClient.setQueryData<Task[]>(key, (old) =>
        old?.map((task) => (task.id === taskId ? { ...task, status } : task)),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
