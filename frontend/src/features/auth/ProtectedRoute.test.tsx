import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"

import { ProtectedRoute } from "./ProtectedRoute"
import { useAuth } from "./auth-context"
import type { AuthContextValue } from "./auth-context"

vi.mock("./auth-context", () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function authState(overrides: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  }
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login screen</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected dashboard</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("ProtectedRoute", () => {
  beforeEach(() => mockedUseAuth.mockReset())

  it("redirects unauthenticated users to /login", () => {
    mockedUseAuth.mockReturnValue(authState({ isAuthenticated: false }))
    renderAt("/")
    expect(screen.getByText("Login screen")).toBeInTheDocument()
    expect(screen.queryByText("Protected dashboard")).not.toBeInTheDocument()
  })

  it("renders protected content when authenticated", () => {
    mockedUseAuth.mockReturnValue(
      authState({
        isAuthenticated: true,
        user: { id: 1, email: "ali@example.com", full_name: "Ali Reza" },
      }),
    )
    renderAt("/")
    expect(screen.getByText("Protected dashboard")).toBeInTheDocument()
  })

  it("shows a loading state while auth is resolving", () => {
    mockedUseAuth.mockReturnValue(authState({ isLoading: true }))
    renderAt("/")
    expect(screen.getByText("Loading…")).toBeInTheDocument()
  })
})
