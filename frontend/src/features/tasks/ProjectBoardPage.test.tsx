import { describe, it, expect, beforeEach } from "vitest"
import { Route, Routes } from "react-router"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ProjectBoardPage } from "./ProjectBoardPage"
import { renderWithProviders } from "../../test/utils"
import { resetMockData } from "../../test/msw/handlers"

function renderBoard() {
  return renderWithProviders(
    <Routes>
      <Route
        path="/teams/:teamId/projects/:projectId"
        element={<ProjectBoardPage />}
      />
    </Routes>,
    { route: "/teams/1/projects/1" },
  )
}

describe("ProjectBoardPage", () => {
  beforeEach(() => {
    resetMockData()
  })

  it("renders tasks on the board", async () => {
    renderBoard()
    expect(await screen.findByText("Set up CI")).toBeInTheDocument()
    expect(screen.getByText("Design schema")).toBeInTheDocument()
  })

  it("creates a task", async () => {
    const user = userEvent.setup()
    renderBoard()
    await screen.findByText("Set up CI")

    await user.type(screen.getByPlaceholderText("New task title"), "Write docs")
    await user.click(screen.getByRole("button", { name: "Add task" }))

    expect(await screen.findByText("Write docs")).toBeInTheDocument()
  })

  it("opens a task and saves edits", async () => {
    const user = userEvent.setup()
    renderBoard()

    await user.click(await screen.findByText("Set up CI"))

    const dialog = await screen.findByRole("dialog")
    const titleInput = within(dialog).getByLabelText("Title")
    await user.clear(titleInput)
    await user.type(titleInput, "Set up CI pipeline")
    await user.click(within(dialog).getByRole("button", { name: "Save" }))

    expect(await screen.findByText("Set up CI pipeline")).toBeInTheDocument()
  })

  it("deletes a task", async () => {
    const user = userEvent.setup()
    renderBoard()

    await user.click(await screen.findByText("Design schema"))
    const dialog = await screen.findByRole("dialog")
    // The modal's delete is a two-step confirm: "Delete" reveals "Confirm",
    // and the actual mutation fires on "Confirm".
    await user.click(within(dialog).getByRole("button", { name: "Delete" }))
    await user.click(within(dialog).getByRole("button", { name: "Confirm" }))

    await waitFor(() =>
      expect(screen.queryByText("Design schema")).not.toBeInTheDocument(),
    )
  })

  it("filters tasks by assignee", async () => {
    const user = userEvent.setup()
    renderBoard()
    await screen.findByText("Set up CI")

    await user.selectOptions(
      screen.getByLabelText("Filter by assignee"),
      "Sam Lee",
    )

    expect(screen.queryByText("Set up CI")).not.toBeInTheDocument()
    expect(screen.getByText("Design schema")).toBeInTheDocument()
  })

  it("switches to the list view and filters by status", async () => {
    const user = userEvent.setup()
    renderBoard()
    await screen.findByText("Set up CI")

    await user.click(screen.getByRole("button", { name: "List" }))
    expect(screen.getByText("Set up CI")).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText("Filter by status"), "To do")
    expect(screen.getByText("Set up CI")).toBeInTheDocument()
    expect(screen.queryByText("Design schema")).not.toBeInTheDocument()
  })

  it("opens a task from a list row", async () => {
    const user = userEvent.setup()
    renderBoard()
    await screen.findByText("Set up CI")

    await user.click(screen.getByRole("button", { name: "List" }))
    await user.click(screen.getByText("Set up CI"))

    expect(await screen.findByDisplayValue("Set up CI")).toBeInTheDocument()
  })

  it("shows skeletons while loading", () => {
    renderBoard()
    expect(screen.getAllByTestId("task-skeleton").length).toBeGreaterThan(0)
  })

  it("shows an empty placeholder for columns with no tasks", async () => {
    renderBoard()
    await screen.findByText("Set up CI")
    expect(screen.getAllByText("No tasks").length).toBeGreaterThan(0)
  })

  it("exposes each board column as a labelled group", async () => {
    renderBoard()
    await screen.findByText("Set up CI")

    expect(screen.getAllByRole("group")).toHaveLength(5)
    expect(screen.getByRole("group", { name: /Backlog/i })).toBeInTheDocument()
  })

  it("renders each task title as an actionable button", async () => {
    renderBoard()
    expect(
      await screen.findByRole("button", { name: "Set up CI" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Design schema" }),
    ).toBeInTheDocument()
  })

  it("renders a keyboard drag handle on each task card", async () => {
    renderBoard()
    await screen.findByText("Set up CI")

    expect(
      screen.getAllByRole("button", { name: /^Drag / }).length,
    ).toBeGreaterThanOrEqual(2)
  })
})
