import { useState } from "react"

import { type Task, type TaskPriority, type TaskStatus } from "./tasksApi"
import { StatusBadge, PriorityBadge } from "./TaskBadges"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { staggerDelayMs } from "../../lib/motion"
import { EmptyState } from "../../components/ui/EmptyState"

type SortKey = "title" | "status" | "priority" | "assignee" | "due_date"
type SortDir = "asc" | "desc"

const STATUS_ORDER: Record<TaskStatus, number> = {
  backlog: 0,
  todo: 1,
  in_progress: 2,
  in_review: 3,
  done: 4,
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
}

const HEADERS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "assignee", label: "Assignee" },
  { key: "due_date", label: "Due date" },
]

export function ProjectTaskList({
  tasks,
  getAssigneeName,
  onOpen,
}: {
  tasks: Task[]
  getAssigneeName: (assigneeId: number | null) => string
  onOpen: (taskId: number) => void
}) {
  const [sortKey, setSortKey] = useState<SortKey>("status")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const reduced = usePrefersReducedMotion()

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...tasks].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1
    switch (sortKey) {
      case "title":
        return a.title.localeCompare(b.title) * dir
      case "status":
        return (
          (STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
            a.position - b.position) * dir
        )
      case "priority":
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir
      case "assignee":
        return (
          getAssigneeName(a.assignee_id).localeCompare(
            getAssigneeName(b.assignee_id),
          ) * dir
        )
      case "due_date":
        return (a.due_date ?? "").localeCompare(b.due_date ?? "") * dir
      default:
        return 0
    }
  })

  if (sorted.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          icon="list"
          title="No tasks to show"
          description="Add a task above, or change the assignee and status filters."
        />
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-line text-ink-muted border-b text-xs tracking-wide uppercase">
            {HEADERS.map((header) => (
              <th
                key={header.key}
                scope="col"
                aria-sort={
                  sortKey === header.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                className="px-3 py-2 font-semibold"
              >
                <button
                  type="button"
                  onClick={() => toggleSort(header.key)}
                  className="hover:text-ink flex items-center gap-1"
                >
                  {header.label}
                  {sortKey === header.key && (
                    <span aria-hidden="true">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((task, index) => (
            <tr
              key={task.id}
              onClick={() => onOpen(task.id)}
              style={{
                animationDelay: `${staggerDelayMs(index, reduced)}ms`,
              }}
              className="animate-card-in border-line hover:bg-canvas cursor-pointer border-b"
            >
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpen(task.id)
                  }}
                  className="text-ink text-left font-medium hover:underline"
                >
                  {task.title}
                </button>
              </td>
              <td className="text-ink-muted px-3 py-2">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-3 py-2">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="text-ink-muted px-3 py-2">
                {getAssigneeName(task.assignee_id)}
              </td>
              <td className="text-ink-muted px-3 py-2">
                {task.due_date ?? "No date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
