import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ThemeProvider } from "./ThemeProvider"
import { ThemeToggle } from "./ThemeToggle"
import { THEME_STORAGE_KEY } from "./theme-context"

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe("ThemeToggle", () => {
  it("renders Light, System and Dark options", () => {
    renderToggle()
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument()
  })

  it("applies the dark class and persists when Dark is chosen", () => {
    renderToggle()
    fireEvent.click(screen.getByRole("button", { name: "Dark" }))

    expect(document.documentElement).toHaveClass("dark")
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark")
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("removes the dark class when Light is chosen", () => {
    renderToggle()
    fireEvent.click(screen.getByRole("button", { name: "Light" }))

    expect(document.documentElement).not.toHaveClass("dark")
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light")
  })
})
