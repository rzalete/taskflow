import { describe, expect, it } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Route, Routes } from "react-router"

import { ProjectBoardPage } from "./ProjectBoardPage"
import { renderWithProviders } from "../../test/utils"

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
  it("renders tasks on the board", async () => {
    renderBoard()
    expect(await screen.findByText("Set up CI")).toBeInTheDocument()
    expect(await screen.findByText("Design schema")).toBeInTheDocument()
  })

  it("creates a task", async () => {
    renderBoard()
    await screen.findByText("Set up CI")

    await userEvent.type(
      screen.getByPlaceholderText("New task title"),
      "Write docs",
    )
    await userEvent.click(screen.getByRole("button", { name: "Add task" }))

    expect(await screen.findByText("Write docs")).toBeInTheDocument()
  })

  it("opens a task and saves edits", async () => {
    renderBoard()
    await userEvent.click(await screen.findByText("Set up CI"))

    const titleInput = await screen.findByLabelText("Title")
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, "Set up CI pipeline")
    await userEvent.selectOptions(screen.getByLabelText("Priority"), "urgent")
    await userEvent.selectOptions(screen.getByLabelText("Assignee"), "Sam Lee")
    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(await screen.findByText("Set up CI pipeline")).toBeInTheDocument()
  })

  it("deletes a task", async () => {
    renderBoard()
    await userEvent.click(await screen.findByText("Design schema"))

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }))
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }))

    await waitFor(() => {
      expect(screen.queryByText("Design schema")).not.toBeInTheDocument()
    })
  })

  it("filters tasks by assignee", async () => {
    renderBoard()
    expect(await screen.findByText("Set up CI")).toBeInTheDocument()
    expect(screen.getByText("Design schema")).toBeInTheDocument()

    const filter = screen.getByLabelText("Filter by assignee")
    await screen.findByRole("option", { name: "Sam Lee" })
    await userEvent.selectOptions(filter, "Sam Lee")

    expect(screen.queryByText("Set up CI")).not.toBeInTheDocument()
    expect(screen.getByText("Design schema")).toBeInTheDocument()

    await userEvent.selectOptions(filter, "All assignees")
    expect(await screen.findByText("Set up CI")).toBeInTheDocument()
  })
})
