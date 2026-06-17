import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        icon="inbox"
        title="No tasks to show"
        description="Add a task to begin."
      />,
    )
    expect(screen.getByText("No tasks to show")).toBeTruthy()
    expect(screen.getByText("Add a task to begin.")).toBeTruthy()
  })

  it("renders an action when provided", () => {
    render(
      <EmptyState
        icon="inbox"
        title="Empty"
        action={<button type="button">Add</button>}
      />,
    )
    expect(screen.getByRole("button", { name: "Add" })).toBeTruthy()
  })
})
