import { describe, expect, it } from "vitest"

import { formatDueDate, getInitials } from "./taskFormat"

describe("getInitials", () => {
  it("uses first and last initial for multi-word names", () => {
    expect(getInitials("Ali Reza")).toBe("AR")
  })

  it("uses up to two letters for a single name", () => {
    expect(getInitials("Madonna")).toBe("MA")
  })

  it("falls back to ? for blank input", () => {
    expect(getInitials("   ")).toBe("?")
  })
})

describe("formatDueDate", () => {
  // Fixed “today” so the relative labels are deterministic.
  const now = new Date(2026, 5, 12) // 12 Jun 2026, local time

  it("returns null when there is no due date", () => {
    expect(formatDueDate(null, now)).toBeNull()
  })

  it("labels today, tomorrow, and yesterday", () => {
    expect(formatDueDate("2026-06-12", now)?.label).toBe("Today")
    expect(formatDueDate("2026-06-13", now)?.label).toBe("Tomorrow")
    expect(formatDueDate("2026-06-11", now)?.label).toBe("Yesterday")
  })

  it("labels the near future and near past in days", () => {
    expect(formatDueDate("2026-06-15", now)?.label).toBe("In 3 days")
    expect(formatDueDate("2026-06-09", now)?.label).toBe("3 days ago")
  })

  it("reports overdue as a negative daysUntil", () => {
    expect(formatDueDate("2026-06-10", now)!.daysUntil).toBeLessThan(0)
  })
})
