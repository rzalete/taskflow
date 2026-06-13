import { useRef, useState, type FormEvent } from "react"

import { type Member } from "../teams/membersApi"
import {
  PRIORITY_LABELS,
  type Task,
  type TaskPriority,
  type UpdateTaskPayload,
} from "./tasksApi"
import { useDeleteTask, useUpdateTask } from "./useTasks"
import { useToast } from "../../components/toast/toast-context"
import { useModalA11y } from "../../hooks/useModalA11y"
import { Button } from "../../components/ui/Button"

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"]

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-brand-500 focus:outline-none"

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

  const dialogRef = useRef<HTMLDivElement>(null)
  useModalA11y(dialogRef, onClose)

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
      className="animate-overlay-show fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        tabIndex={-1}
        className="rounded-card shadow-popover animate-dialog-show flex w-full max-w-lg flex-col overflow-hidden bg-white ring-1 ring-black/5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2
            id="task-details-title"
            className="text-base font-semibold tracking-tight text-slate-900"
          >
            Task details
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col">
          <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
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
                className={inputClass}
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
                className={inputClass}
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
                  className={inputClass}
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
                  className={inputClass}
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
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            {confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Delete this task?
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteTask.isPending}
                >
                  Confirm
                </Button>
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
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
