/**
 * Pure formatting helpers for task cards. Kept framework-free so they can be
 * unit-tested directly (see taskFormat.test.ts).
 */

const MS_PER_DAY = 86_400_000

export type DueDateInfo = {
  /** Short, human-readable label, e.g. "Today", "In 3 days", "Jun 20". */
  label: string
  /** Whole days from today to the due date. Negative means overdue. */
  daysUntil: number
}

/**
 * Format a `YYYY-MM-DD` due date relative to `now` (defaults to the current
 * date). Returns null for a missing or unparseable date. `now` is injectable
 * so tests are deterministic.
 */
export function formatDueDate(
  dueDate: string | null,
  now: Date = new Date(),
): DueDateInfo | null {
  if (!dueDate) return null

  const [year, month, day] = dueDate.split("-").map(Number)
  if (!year || !month || !day) return null

  const due = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysUntil = Math.round((due.getTime() - today.getTime()) / MS_PER_DAY)

  let label: string
  if (daysUntil === 0) label = "Today"
  else if (daysUntil === 1) label = "Tomorrow"
  else if (daysUntil === -1) label = "Yesterday"
  else if (daysUntil > 1 && daysUntil <= 7) label = `In ${daysUntil} days`
  else if (daysUntil < -1 && daysUntil >= -7)
    label = `${Math.abs(daysUntil)} days ago`
  else
    label = due.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })

  return { label, daysUntil }
}

/** Derive up to two uppercase initials from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}
