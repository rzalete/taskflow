import { describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderWithProviders } from "../../test/utils"
import { TaskDetailModal } from "./TaskDetailModal"
import { type Task } from "./tasksApi"

const task: Task = {
  id: 1,
  title: "Write tests",
  description: null,
  status: "todo",
  priority: "medium",
  due_date: null,
  project_id: 1,
  assignee_id: null,
  position: 0,
}

function renderModal() {
  const onClose = vi.fn()
  const result = renderWithProviders(
    <TaskDetailModal
      task={task}
      teamId={1}
      projectId={1}
      members={[]}
      onClose={onClose}
    />,
  )
  return { onClose, ...result }
}

describe("TaskDetailModal accessibility", () => {
  it("exposes dialog semantics with an accessible name", () => {
    renderModal()
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(dialog).toHaveAccessibleName("Task details")
  })

  it("closes when Escape is pressed", async () => {
    const { onClose } = renderModal()
    await userEvent.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("locks body scroll while open and restores it on close", () => {
    const { unmount } = renderModal()
    expect(document.body.style.overflow).toBe("hidden")
    unmount()
    expect(document.body.style.overflow).toBe("")
  })
})
