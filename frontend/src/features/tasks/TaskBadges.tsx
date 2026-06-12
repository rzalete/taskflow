import {
  PRIORITY_CLASSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
  type TaskPriority,
  type TaskStatus,
} from "./tasksApi"

const badgeBase =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`${badgeBase} ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`${badgeBase} ${PRIORITY_CLASSES[priority]}`}>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
