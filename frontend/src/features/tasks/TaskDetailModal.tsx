import { useState, type FormEvent } from "react"

import { type Member } from "../teams/membersApi"
import {
  PRIORITY_LABELS,
  type Task,
  type TaskPriority,
  type UpdateTaskPayload,
} from "./tasksApi"
import { useDeleteTask, useUpdateTask } from "./useTasks"
import { useToast } from "../../components/toast/toast-context"

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"]

export function TaskDetailModal({
  task,
  teamId,
  projectId,
  members,
  onClose,
}: {
  task: Task
  teamId: number
  projectId: number
  members: Member[]
  onClose: () => void
}) {
  const updateTask = useUpdateTask(teamId, projectId)
  const deleteTask = useDeleteTask(teamId, projectId)

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? "")
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date ?? "")
  const [assigneeId, setAssigneeId] = useState(
    task.assignee_id !== null ? String(task.assignee_id) : "",
  )
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const toast = useToast()

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload: UpdateTaskPayload = {
      title: title.trim(),
      description: description.trim() === "" ? null : description.trim(),
      priority,
      due_date: dueDate === "" ? null : dueDate,
      assignee_id: assigneeId === "" ? null : Number(assigneeId),
    }
    try {
      await updateTask.mutateAsync({ taskId: task.id, payload })
      toast.success("Task updated")
      onClose()
    } catch {
      toast.error("Couldn't save changes. Please try again.")
    }
  }

  async function handleDelete() {
    try {
      await deleteTask.mutateAsync(task.id)
      toast.success("Task deleted")
      onClose()
    } catch (err) {
      const status =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
      toast.error(
        status === 403
          ? "Only an owner or admin can delete a task."
          : "Couldn't delete the task. Please try again.",
      )
      setConfirmingDelete(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Task details</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <input
              id="task-title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-priority"
                className="block text-sm font-medium text-slate-700"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                {PRIORITIES.map((value) => (
                  <option key={value} value={value}>
                    {PRIORITY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="task-due"
                className="block text-sm font-medium text-slate-700"
              >
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="task-assignee"
              className="block text-sm font-medium text-slate-700"
            >
              Assignee
            </label>
            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            {confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Delete this task?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteTask.isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="text-sm text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateTask.isPending}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
