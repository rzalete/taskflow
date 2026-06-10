import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createTask,
  deleteTask,
  getTasks,
  moveTask,
  updateTask,
  type CreateTaskPayload,
  type Task,
  type TaskStatus,
  type UpdateTaskPayload,
} from "./tasksApi"

function tasksKey(teamId: number, projectId: number) {
  return ["teams", teamId, "projects", projectId, "tasks"] as const
}

export function applyMove(
  tasks: Task[],
  taskId: number,
  status: TaskStatus,
  position: number,
): Task[] {
  const moved = tasks.find((task) => task.id === taskId)
  if (!moved) return tasks
  const sourceStatus = moved.status
  const byPosition = (a: Task, b: Task) => a.position - b.position

  // Destination column without the moved card; re-insert at the clamped
  // index, then renumber the column densely (0..n).
  const destination = tasks
    .filter((task) => task.status === status && task.id !== taskId)
    .sort(byPosition)
  const index = Math.max(0, Math.min(position, destination.length))
  destination.splice(index, 0, { ...moved, status })
  const renumberedDestination = destination.map((task, i) => ({
    ...task,
    position: i,
  }))

  if (sourceStatus === status) {
    const others = tasks.filter((task) => task.status !== status)
    return [...others, ...renumberedDestination]
  }

  // Cross-column move: also close the gap left in the source column.
  const renumberedSource = tasks
    .filter((task) => task.status === sourceStatus && task.id !== taskId)
    .sort(byPosition)
    .map((task, i) => ({ ...task, position: i }))
  const untouched = tasks.filter(
    (task) => task.status !== status && task.status !== sourceStatus,
  )
  return [...untouched, ...renumberedSource, ...renumberedDestination]
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
    mutationFn: ({
      taskId,
      status,
      position,
    }: {
      taskId: number
      status: TaskStatus
      position: number
    }) => moveTask(teamId, projectId, taskId, { status, position }),
    onMutate: async ({ taskId, status, position }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Task[]>(key)
      queryClient.setQueryData<Task[]>(key, (old) =>
        old ? applyMove(old, taskId, status, position) : old,
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

export function useUpdateTask(teamId: number, projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: number
      payload: UpdateTaskPayload
    }) => updateTask(teamId, projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(teamId, projectId) })
    },
  })
}

export function useDeleteTask(teamId: number, projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(teamId, projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(teamId, projectId) })
    },
  })
}
