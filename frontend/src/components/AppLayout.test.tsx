import { describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import { Route, Routes } from "react-router"

import { AppLayout } from "./AppLayout"
import { renderWithProviders } from "../test/utils"

vi.mock("../features/auth/auth-context", () => ({
  useAuth: () => ({
    user: { id: 1, email: "ali@example.com", full_name: "Ali Reza" },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

describe("AppLayout", () => {
  it("lists the user's teams in the sidebar", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<div>Home content</div>} />
        </Route>
      </Routes>,
      { route: "/" },
    )

    expect(await screen.findByText("Engineering")).toBeInTheDocument()
    expect(await screen.findByText("Marketing")).toBeInTheDocument()
    expect(screen.getByText("Home content")).toBeInTheDocument()
  })
})
