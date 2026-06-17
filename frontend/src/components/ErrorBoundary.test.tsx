import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ErrorBoundary } from "./ErrorBoundary"

function Boom(): never {
  throw new Error("boom")
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText("All good")).toBeTruthy()
  })

  it("renders the fallback when a child throws", () => {
    // React logs the caught error to the console; silence it for a clean run.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText("This screen hit an error")).toBeTruthy()
    spy.mockRestore()
  })
})
