import { type ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"

export function BoardColumn({
  id,
  title,
  count,
  children,
}: {
  id: string
  title: string
  count: number
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-xl bg-slate-100 p-3 ${
        isOver ? "ring-2 ring-slate-400" : ""
      }`}
    >
      <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{title}</span>
        <span className="rounded-full bg-slate-200 px-2 text-xs text-slate-600">
          {count}
        </span>
      </h3>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  )
}
