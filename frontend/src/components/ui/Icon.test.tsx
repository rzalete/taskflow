import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Icon } from "./Icon"

describe("Icon", () => {
  it("renders an svg with the 24x24 viewBox", () => {
    const { container } = render(<Icon name="plus" />)
    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24")
  })

  it("is hidden from screen readers without a title", () => {
    const { container } = render(<Icon name="search" />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("aria-hidden")).toBe("true")
    expect(svg?.getAttribute("role")).toBeNull()
  })

  it("exposes a label when given a title", () => {
    const { container, getByTitle } = render(
      <Icon name="alert" title="Warning" />,
    )
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("role")).toBe("img")
    expect(svg?.getAttribute("aria-hidden")).toBeNull()
    expect(getByTitle("Warning")).toBeTruthy()
  })
})
