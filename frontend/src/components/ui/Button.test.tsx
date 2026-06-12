import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "./Button"

describe("Button", () => {
  it("renders its children and defaults to type=button", () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "button",
    )
  })

  it("uses the primary variant by default", () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass(
      "bg-slate-900",
    )
  })

  it("applies the danger variant", () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "bg-red-600",
    )
  })

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Click" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick while disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Click" }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
