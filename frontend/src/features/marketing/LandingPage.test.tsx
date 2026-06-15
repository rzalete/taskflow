import { describe, expect, it, vi } from "vitest"
import { screen, within } from "@testing-library/react"

import { LandingPage } from "./LandingPage"
import { renderWithProviders } from "../../test/utils"

vi.mock("../auth/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

describe("LandingPage", () => {
  it("renders the hero headline", () => {
    renderWithProviders(<LandingPage />)
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /keep your team's projects on one board/i,
      }),
    ).toBeInTheDocument()
  })

  it("points the header's primary CTA at the register route", () => {
    renderWithProviders(<LandingPage />)
    const banner = screen.getByRole("banner")
    expect(
      within(banner).getByRole("link", { name: "Start free" }),
    ).toHaveAttribute("href", "/register")
  })

  it("renders the feature and showcase sections plus the footer", () => {
    renderWithProviders(<LandingPage />)
    expect(
      screen.getByRole("heading", {
        name: /everything a small team needs to run a project/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /plan on a board that keeps up/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
