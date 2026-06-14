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
    setActivatorNodeRef,
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
    ? "text-red-700"
    : due !== null && due.daysUntil === 0
      ? "text-amber-700"
      : "text-ink-muted"

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onOpen(task.id)}
      {...listeners}
      className={`rounded-card shadow-card hover:shadow-card-hover border-line bg-surface cursor-grab border border-l-4 p-3 transition-[box-shadow,transform] hover:-translate-y-0.5 ${
        PRIORITY_ACCENT[task.priority]
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpen(task.id)
          }}
          className="hover:text-brand-accent text-ink rounded text-left text-sm font-medium hover:underline"
        >
          {task.title}
        </button>

        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          aria-label={`Drag ${task.title}`}
          onClick={(event) => event.stopPropagation()}
          className="hover:text-brand-600 text-ink-faint shrink-0 cursor-grab rounded p-1"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <circle cx="7" cy="5" r="1.5" />
            <circle cx="13" cy="5" r="1.5" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="13" cy="10" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
          </svg>
        </button>
      </div>

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
