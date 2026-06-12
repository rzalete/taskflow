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
      className={`flex w-64 shrink-0 flex-col rounded-xl bg-slate-100 p-3 transition-colors ${
        isOver ? "bg-brand-50 ring-brand-500 ring-2" : ""
      }`}
    >
      <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{title}</span>
        <span className="rounded-full bg-slate-200 px-2 text-xs text-slate-600">
          {count}
        </span>
      </h3>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {children}
          {count === 0 && !loading && (
            <p
              className={`rounded-card border border-dashed py-6 text-center text-xs transition-colors ${
                isOver
                  ? "border-brand-500 text-brand-700"
                  : "border-slate-300 text-slate-400"
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
