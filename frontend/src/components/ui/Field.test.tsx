import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Field } from "./Field"

describe("Field", () => {
  it("links the label to the input through the id", () => {
    render(<Field id="email" label="Email" />)
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email")
  })

  it("wires an error message via aria-describedby", () => {
    render(<Field id="email" label="Email" error="Required" />)
    const input = screen.getByLabelText("Email")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "email-error")
    expect(screen.getByText("Required")).toHaveAttribute("id", "email-error")
  })

  it("omits error wiring when there is no error", () => {
    render(<Field id="email" label="Email" />)
    const input = screen.getByLabelText("Email")
    expect(input).not.toHaveAttribute("aria-invalid")
    expect(input).not.toHaveAttribute("aria-describedby")
  })
})
