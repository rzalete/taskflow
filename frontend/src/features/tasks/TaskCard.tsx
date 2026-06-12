import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { type Task } from "./tasksApi"
import { PriorityBadge } from "./TaskBadges"

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
      <PriorityBadge priority={task.priority} />
    </div>
  )
}
