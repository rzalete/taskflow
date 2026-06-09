import { useDraggable } from "@dnd-kit/core"

import { type Task, type TaskPriority } from "./tasksApi"

const priorityClass: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
}

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="text-sm font-medium text-slate-900">{task.title}</p>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityClass[task.priority]}`}
      >
        {task.priority}
      </span>
    </div>
  )
}
