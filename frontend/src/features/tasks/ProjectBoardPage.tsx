import { useRef, useState, type FormEvent } from "react"
import { useParams } from "react-router"
import {
  closestCorners,
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
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const justDraggedRef = useRef(false)

  const selectedTask =
    tasksQuery.data?.find((task) => task.id === selectedTaskId) ?? null

  const visibleTasks = (tasksQuery.data ?? []).filter((task) => {
    if (assigneeFilter === "all") return true
    if (assigneeFilter === "unassigned") return task.assignee_id === null
    return task.assignee_id === Number(assigneeFilter)
  })

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
    justDraggedRef.current = true
    window.setTimeout(() => {
      justDraggedRef.current = false
    }, 0)
    if (!over) return

    const activeId = Number(active.id)
    const tasks = tasksQuery.data ?? []
    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask) return

    // `over` is either a column (dropped on empty space) or another card.
    const overColumn = COLUMNS.find((column) => column.status === over.id)
    const overTask = overColumn
      ? undefined
      : tasks.find((task) => task.id === Number(over.id))

    let destStatus: TaskStatus
    if (overColumn) {
      destStatus = overColumn.status
    } else if (overTask) {
      destStatus = overTask.status
    } else {
      return
    }

    // Compute the target index against the FULL destination column (sorted by
    // position), so the drop is correct even with an assignee filter active.
    const columnIds = tasks
      .filter((task) => task.status === destStatus)
      .sort((a, b) => a.position - b.position)
      .map((task) => task.id)

    let position: number
    if (destStatus === activeTask.status) {
      const oldIndex = columnIds.indexOf(activeId)
      const newIndex = overTask
        ? columnIds.indexOf(overTask.id)
        : columnIds.length - 1
      if (oldIndex === newIndex) return
      position = newIndex
    } else {
      position = overTask ? columnIds.indexOf(overTask.id) : columnIds.length
    }

    moveTask.mutate({ taskId: activeId, status: destStatus, position })
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

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-slate-600">Assignee:</span>
        <select
          aria-label="Filter by assignee"
          value={assigneeFilter}
          onChange={(event) => setAssigneeFilter(event.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {(membersQuery.data ?? []).map((member) => (
            <option key={member.user_id} value={String(member.user_id)}>
              {member.full_name}
            </option>
          ))}
        </select>
      </div>

      {tasksQuery.isError && (
        <p className="mt-4 text-sm text-red-600">Couldn't load tasks.</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = visibleTasks
              .filter((task) => task.status === column.status)
              .sort((a, b) => a.position - b.position)
            return (
              <BoardColumn
                key={column.status}
                id={column.status}
                title={column.title}
                count={columnTasks.length}
                taskIds={columnTasks.map((task) => task.id)}
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
