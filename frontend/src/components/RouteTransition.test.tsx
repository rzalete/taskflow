import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, it, vi } from "vitest"

import { RouteTransition } from "./RouteTransition"

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("RouteTransition", () => {
  it("renders its children", () => {
    stubMatchMedia(false)
    render(
      <MemoryRouter>
        <RouteTransition>
          <p>Route content</p>
        </RouteTransition>
      </MemoryRouter>,
    )
    expect(screen.getByText("Route content")).toBeInTheDocument()
  })

  it("applies the enter animation when reduced motion is off", () => {
    stubMatchMedia(false)
    render(
      <MemoryRouter>
        <RouteTransition>
          <p>Animated</p>
        </RouteTransition>
      </MemoryRouter>,
    )
    expect(screen.getByText("Animated").parentElement).toHaveClass(
      "animate-fade-in-up",
    )
  })

  it("skips the animation class under reduced motion but keeps the className", () => {
    stubMatchMedia(true)
    render(
      <MemoryRouter>
        <RouteTransition className="custom">
          <p>Still</p>
        </RouteTransition>
      </MemoryRouter>,
    )
    const wrapper = screen.getByText("Still").parentElement
    expect(wrapper).not.toHaveClass("animate-fade-in-up")
    expect(wrapper).toHaveClass("custom")
  })
})
