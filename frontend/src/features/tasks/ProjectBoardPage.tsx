import { useRef, useState, type FormEvent } from "react"
import { useParams } from "react-router"
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { useProject } from "../projects/useProjects"
import { BoardColumn } from "./BoardColumn"
import { TaskCard } from "./TaskCard"
import { TaskCardSkeleton } from "./TaskCardSkeleton"
import { STATUS_LABELS, type TaskStatus } from "./tasksApi"
import { useCreateTask, useMoveTask, useTasks } from "./useTasks"
import { useMembers } from "../teams/useMembers"
import { TaskDetailModal } from "./TaskDetailModal"
import { ProjectTaskList } from "./ProjectTaskList"
import { Button } from "../../components/ui/Button"

const COLUMNS: { status: TaskStatus; title: string }[] = (
  ["backlog", "todo", "in_progress", "in_review", "done"] as const
).map((status) => ({ status, title: STATUS_LABELS[status] }))

// Filter dropdowns share the design-language field styling (shadow + brand focus).
const selectClass =
  "rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none"

// Segmented-control button styling for the Board / List toggle.
function segmentClass(active: boolean) {
  return [
    "rounded-md px-3 py-1 text-sm font-medium transition-colors",
    active
      ? "bg-white text-brand-700 shadow-sm"
      : "text-slate-600 hover:text-slate-900",
  ].join(" ")
}

export function ProjectBoardPage() {
  const { teamId, projectId } = useParams()
  const team = Number(teamId)
  const project = Number(projectId)

  const projectQuery = useProject(team, project)
  const tasksQuery = useTasks(team, project)
  const createTask = useCreateTask(team, project)
  const moveTask = useMoveTask(team, project)

  const [title, setTitle] = useState("")
  const [view, setView] = useState<"board" | "list">("board")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

  const listTasks = visibleTasks.filter(
    (task) => statusFilter === "all" || task.status === statusFilter,
  )

  const memberName = (assigneeId: number | null) => {
    if (assigneeId === null) return "Unassigned"
    const member = membersQuery.data?.find((m) => m.user_id === assigneeId)
    return member?.full_name ?? `User ${assigneeId}`
  }

  // Labels for the drag-and-drop screen-reader announcements. A dnd-kit id is a
  // UniqueIdentifier (string | number): a task id, or a column status string
  // when a card is dropped on empty column space.
  const taskTitleById = (id: string | number) =>
    (tasksQuery.data ?? []).find((task) => task.id === Number(id))?.title ??
    "the task"

  const dropTargetLabel = (id: string | number) => {
    const column = COLUMNS.find((col) => col.status === id)
    return column ? `the ${column.title} column` : taskTitleById(id)
  }

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
          className="focus:border-brand-500 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none"
        />
        <Button type="submit" disabled={createTask.isPending}>
          Add task
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setView("board")}
            aria-pressed={view === "board"}
            className={segmentClass(view === "board")}
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={segmentClass(view === "list")}
          >
            List
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Assignee:</span>
          <select
            aria-label="Filter by assignee"
            value={assigneeFilter}
            onChange={(event) => setAssigneeFilter(event.target.value)}
            className={selectClass}
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

        {view === "list" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Status:</span>
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={selectClass}
            >
              <option value="all">All statuses</option>
              {COLUMNS.map((column) => (
                <option key={column.status} value={column.status}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {tasksQuery.isError && (
        <p className="mt-4 text-sm text-red-600">Couldn't load tasks.</p>
      )}

      {view === "board" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          accessibility={{
            announcements: {
              onDragStart: ({ active }) =>
                `Picked up ${taskTitleById(active.id)}.`,
              onDragOver: ({ active, over }) =>
                over
                  ? `${taskTitleById(active.id)} is over ${dropTargetLabel(over.id)}.`
                  : `${taskTitleById(active.id)} is no longer over a drop target.`,
              onDragEnd: ({ active, over }) =>
                over
                  ? `${taskTitleById(active.id)} was dropped onto ${dropTargetLabel(over.id)}.`
                  : `${taskTitleById(active.id)} was dropped.`,
              onDragCancel: ({ active }) =>
                `Dragging ${taskTitleById(active.id)} was cancelled.`,
            },
            screenReaderInstructions: {
              draggable:
                "To pick up a task, focus its drag handle and press Space or Enter. Use the arrow keys to move it between positions and columns. Press Space or Enter to drop, or Escape to cancel.",
            },
          }}
        >
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column, index) => {
              const columnTasks = visibleTasks
                .filter((task) => task.status === column.status)
                .sort((a, b) => a.position - b.position)
              return (
                <BoardColumn
                  key={column.status}
                  index={index}
                  id={column.status}
                  title={column.title}
                  count={columnTasks.length}
                  taskIds={columnTasks.map((task) => task.id)}
                  loading={tasksQuery.isPending}
                >
                  {tasksQuery.isPending
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <TaskCardSkeleton key={index} />
                      ))
                    : columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assigneeName={memberName(task.assignee_id)}
                          onOpen={handleOpen}
                        />
                      ))}
                </BoardColumn>
              )
            })}
          </div>
        </DndContext>
      ) : (
        <ProjectTaskList
          tasks={listTasks}
          getAssigneeName={memberName}
          onOpen={handleOpen}
        />
      )}
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
