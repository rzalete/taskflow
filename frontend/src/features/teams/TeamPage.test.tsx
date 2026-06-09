import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Route, Routes } from "react-router"

import { TeamPage } from "./TeamPage"
import { renderWithProviders } from "../../test/utils"

function renderTeamPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/teams/:teamId" element={<TeamPage />} />
    </Routes>,
    { route: "/teams/1" },
  )
}

describe("TeamPage", () => {
  it("shows the team name and its projects", async () => {
    renderTeamPage()
    expect(await screen.findByText("Engineering")).toBeInTheDocument()
    expect(await screen.findByText("Website redesign")).toBeInTheDocument()
  })

  it("creates a new project", async () => {
    renderTeamPage()
    await screen.findByText("Website redesign")

    await userEvent.type(
      screen.getByPlaceholderText("New project name"),
      "Mobile app",
    )
    await userEvent.click(screen.getByRole("button", { name: "Add" }))

    expect(await screen.findByText("Mobile app")).toBeInTheDocument()
  })
})
