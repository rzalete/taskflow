import { describe, expect, it, vi } from "vitest"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Route, Routes } from "react-router"

import { TeamPage } from "./TeamPage"
import { renderWithProviders } from "../../test/utils"

vi.mock("../auth/auth-context", () => ({
  useAuth: () => ({
    user: { id: 1, email: "ali@example.com", full_name: "Ali Reza" },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

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

  it("lists team members with their roles", async () => {
    renderTeamPage()
    expect(await screen.findByText("Sam Lee")).toBeInTheDocument()
    expect(screen.getByText("sam@example.com")).toBeInTheDocument()
  })

  it("adds a member by email", async () => {
    renderTeamPage()
    await screen.findByText("Sam Lee")

    await userEvent.type(
      screen.getByPlaceholderText("Add member by email"),
      "riya@example.com",
    )
    await userEvent.click(screen.getByRole("button", { name: "Add member" }))

    expect(await screen.findByText("Riya Patel")).toBeInTheDocument()
  })

  it("removes a member", async () => {
    renderTeamPage()
    const samRow = (await screen.findByText("Sam Lee")).closest("li")
    expect(samRow).not.toBeNull()

    await userEvent.click(
      within(samRow as HTMLElement).getByRole("button", { name: "Remove" }),
    )
    await userEvent.click(
      within(samRow as HTMLElement).getByRole("button", { name: "Confirm" }),
    )

    await waitFor(() =>
      expect(screen.queryByText("Sam Lee")).not.toBeInTheDocument(),
    )
  })
})
