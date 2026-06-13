import { type ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export function BoardColumn({
  id,
  title,
  count,
  taskIds,
  loading = false,
  children,
}: {
  id: string
  title: string
  count: number
  taskIds: number[]
  loading?: boolean
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      role="group"
      aria-label={`${title}, ${count} ${count === 1 ? "task" : "tasks"}`}
      className={`flex w-64 shrink-0 flex-col rounded-xl bg-slate-100 p-3 ring-1 transition-colors ring-inset ${
        isOver ? "bg-brand-50 ring-brand-500 ring-2" : "ring-slate-200/60"
      }`}
    >
      <h3 className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wide text-slate-600 uppercase">
        <span>{title}</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 ring-inset">
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
                  ? "border-brand-500 bg-brand-50/50 text-brand-700"
                  : "border-slate-300 text-slate-600"
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
