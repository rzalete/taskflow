import { describe, expect, it } from "vitest"

import { MAX_STAGGER_STEPS, STAGGER_STEP_MS, staggerDelayMs } from "./motion"

describe("staggerDelayMs", () => {
  it("returns 0 for the first item", () => {
    expect(staggerDelayMs(0, false)).toBe(0)
  })

  it("scales the delay by index", () => {
    expect(staggerDelayMs(3, false)).toBe(3 * STAGGER_STEP_MS)
  })

  it("caps the delay at MAX_STAGGER_STEPS", () => {
    expect(staggerDelayMs(50, false)).toBe(MAX_STAGGER_STEPS * STAGGER_STEP_MS)
  })

  it("returns 0 when reduced motion is requested", () => {
    expect(staggerDelayMs(5, true)).toBe(0)
  })
})
