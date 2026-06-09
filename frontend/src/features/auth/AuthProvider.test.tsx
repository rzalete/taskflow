import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AuthProvider } from "./AuthProvider"
import { useAuth } from "./auth-context"
import { setToken } from "../../lib/token"

function AuthProbe() {
  const { isAuthenticated, isLoading, user, login } = useAuth()
  const status = isLoading ? "loading" : isAuthenticated ? "authed" : "anon"
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user">{user?.full_name ?? "none"}</span>
      <button
        onClick={() =>
          login({ email: "ali@example.com", password: "secret123" })
        }
      >
        Sign in
      </button>
    </div>
  )
}

function renderProvider() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe("AuthProvider", () => {
  it("starts anonymous when there is no token", () => {
    renderProvider()
    expect(screen.getByTestId("status")).toHaveTextContent("anon")
  })

  it("resolves to authenticated when a stored token is valid", async () => {
    setToken("valid-token")
    renderProvider()
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("authed"),
    )
    expect(screen.getByTestId("user")).toHaveTextContent("Ali Reza")
  })

  it("logs in via the login() action", async () => {
    renderProvider()
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }))
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("authed"),
    )
  })
})
