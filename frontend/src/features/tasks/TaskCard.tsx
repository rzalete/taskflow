import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { PRIORITY_CLASSES, type Task } from "./tasksApi"

export function TaskCard({
  task,
  onOpen,
}: {
  task: Task
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task.id)}
      className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="text-sm font-medium text-slate-900">{task.title}</p>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASSES[task.priority]}`}
      >
        {task.priority}
      </span>
    </div>
  )
}
