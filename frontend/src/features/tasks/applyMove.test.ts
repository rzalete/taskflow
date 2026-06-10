import { describe, expect, it } from "vitest"

import { type Task } from "./tasksApi"
import { applyMove } from "./useTasks"

function makeTask(partial: Partial<Task> & { id: number }): Task {
  return {
    id: partial.id,
    title: partial.title ?? `Task ${partial.id}`,
    description: null,
    status: partial.status ?? "todo",
    priority: "medium",
    due_date: null,
    project_id: 1,
    assignee_id: null,
    position: partial.position ?? 0,
  }
}

function column(tasks: Task[], status: string) {
  return tasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.position - b.position)
    .map((task) => [task.title, task.position] as const)
}

describe("applyMove", () => {
  it("reorders within a column", () => {
    const tasks = [
      makeTask({ id: 1, title: "A", status: "todo", position: 0 }),
      makeTask({ id: 2, title: "B", status: "todo", position: 1 }),
      makeTask({ id: 3, title: "C", status: "todo", position: 2 }),
    ]
    const result = applyMove(tasks, 3, "todo", 0)
    expect(column(result, "todo")).toEqual([
      ["C", 0],
      ["A", 1],
      ["B", 2],
    ])
  })

  it("moves across columns and reindexes both", () => {
    const tasks = [
      makeTask({ id: 1, title: "A", status: "todo", position: 0 }),
      makeTask({ id: 2, title: "B", status: "todo", position: 1 }),
      makeTask({ id: 4, title: "D", status: "done", position: 0 }),
    ]
    const result = applyMove(tasks, 1, "done", 0)
    expect(column(result, "todo")).toEqual([["B", 0]])
    expect(column(result, "done")).toEqual([
      ["A", 0],
      ["D", 1],
    ])
  })

  it("clamps an out-of-range position to the end of the column", () => {
    const tasks = [
      makeTask({ id: 1, title: "A", status: "todo", position: 0 }),
      makeTask({ id: 2, title: "B", status: "done", position: 0 }),
    ]
    const result = applyMove(tasks, 1, "done", 99)
    expect(column(result, "done")).toEqual([
      ["B", 0],
      ["A", 1],
    ])
  })
})
