import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { type Task, type TaskPriority } from "./tasksApi"
import { PriorityBadge } from "./TaskBadges"
import { Avatar } from "./Avatar"
import { formatDueDate } from "./taskFormat"

// Left-edge accent color per priority (matches the badge palette).
const PRIORITY_ACCENT: Record<TaskPriority, string> = {
  low: "border-l-slate-300",
  medium: "border-l-blue-400",
  high: "border-l-amber-400",
  urgent: "border-l-red-500",
}

export function TaskCard({
  task,
  assigneeName,
  onOpen,
}: {
  task: Task
  assigneeName?: string | null
  onOpen: (taskId: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const due = formatDueDate(task.due_date)
  const overdue = due !== null && due.daysUntil < 0 && task.status !== "done"
  const dueClass = overdue
    ? "text-red-600"
    : due !== null && due.daysUntil === 0
      ? "text-amber-600"
      : "text-slate-500"

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onOpen(task.id)}
      {...attributes}
      {...listeners}
      className={`rounded-card shadow-card hover:shadow-card-hover cursor-grab border border-l-4 border-slate-200 bg-white p-3 transition-shadow ${
        PRIORITY_ACCENT[task.priority]
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <p className="text-sm font-medium text-slate-800">{task.title}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2">
          {due !== null && (
            <span className={`text-xs font-medium ${dueClass}`}>
              {due.label}
            </span>
          )}
          {task.assignee_id !== null && assigneeName ? (
            <Avatar name={assigneeName} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
