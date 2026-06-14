import { type ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export function BoardColumn({
  id,
  title,
  count,
  taskIds,
  index = 0,
  loading = false,
  children,
}: {
  id: string
  title: string
  count: number
  taskIds: number[]
  index?: number
  loading?: boolean
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      role="group"
      aria-label={`${title}, ${count} ${count === 1 ? "task" : "tasks"}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`animate-board-column-in rounded-card bg-well flex min-w-0 flex-1 flex-col p-3 ring-1 transition-colors ring-inset ${
        isOver ? "bg-brand-soft ring-brand-500 ring-2" : "ring-line/70"
      }`}
    >
      <h3 className="text-ink-muted mb-3 flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
        <span>{title}</span>
        <span className="rounded-pill bg-surface text-ink-muted ring-line px-2 py-0.5 text-xs font-medium ring-1 ring-inset">
          {count}
        </span>
      </h3>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {children}
          {count === 0 && !loading && (
            <p
              className={`rounded-card border border-dashed py-6 text-center text-xs font-medium transition-colors ${
                isOver
                  ? "border-brand-500 bg-brand-soft text-brand-accent"
                  : "border-line-strong text-ink-muted"
              }`}
            >
              {isOver ? "Drop here" : "No tasks"}
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
