import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
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
})
