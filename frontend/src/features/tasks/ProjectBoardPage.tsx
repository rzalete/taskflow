import { useRef, useState, type FormEvent } from "react"
import { useParams } from "react-router"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"

import { useProject } from "../projects/useProjects"
import { BoardColumn } from "./BoardColumn"
import { TaskCard } from "./TaskCard"
import { type TaskStatus } from "./tasksApi"
import { useCreateTask, useMoveTask, useTasks } from "./useTasks"
import { useMembers } from "../teams/useMembers"
import { TaskDetailModal } from "./TaskDetailModal"

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "backlog", title: "Backlog" },
  { status: "todo", title: "To do" },
  { status: "in_progress", title: "In progress" },
  { status: "in_review", title: "In review" },
  { status: "done", title: "Done" },
]

export function ProjectBoardPage() {
  const { teamId, projectId } = useParams()
  const team = Number(teamId)
  const project = Number(projectId)

  const projectQuery = useProject(team, project)
  const tasksQuery = useTasks(team, project)
  const createTask = useCreateTask(team, project)
  const moveTask = useMoveTask(team, project)

  const [title, setTitle] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const membersQuery = useMembers(team)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const justDraggedRef = useRef(false)

  const selectedTask =
    tasksQuery.data?.find((task) => task.id === selectedTaskId) ?? null

  function handleOpen(taskId: number) {
    if (justDraggedRef.current) return
    setSelectedTaskId(taskId)
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await createTask.mutateAsync({ title })
    setTitle("")
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over) {
      const status = over.id as TaskStatus
      const task = tasksQuery.data?.find((t) => t.id === active.id)
      if (task && task.status !== status) {
        moveTask.mutate({ taskId: task.id, status })
      }
    }
    justDraggedRef.current = true
    window.setTimeout(() => {
      justDraggedRef.current = false
    }, 0)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {projectQuery.data?.name ?? "Project"}
      </h1>

      <form
        onSubmit={handleCreate}
        className="mt-4 flex max-w-md items-center gap-2"
      >
        <input
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New task title"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={createTask.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          Add task
        </button>
      </form>

      {tasksQuery.isError && (
        <p className="mt-4 text-sm text-red-600">Couldn't load tasks.</p>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnTasks =
              tasksQuery.data?.filter(
                (task) => task.status === column.status,
              ) ?? []
            return (
              <BoardColumn
                key={column.status}
                id={column.status}
                title={column.title}
                count={columnTasks.length}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onOpen={handleOpen} />
                ))}
              </BoardColumn>
            )
          })}
        </div>
      </DndContext>
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          teamId={team}
          projectId={project}
          members={membersQuery.data ?? []}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  )
}
