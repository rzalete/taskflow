import { useHealth } from "./useHealth"

export function HealthStatus() {
  const { data, isPending, isError } = useHealth()

  if (isPending) {
    return (
      <span className="rounded-pill bg-well text-ink-muted inline-flex items-center gap-1.5 px-3 py-1 text-sm">
        <span
          aria-hidden="true"
          className="rounded-pill bg-ink-faint h-1.5 w-1.5"
        />
        Checking API…
      </span>
    )
  }

  if (isError) {
    return (
      <span className="rounded-pill bg-danger-soft text-danger-strong inline-flex items-center gap-1.5 px-3 py-1 text-sm">
        <span
          aria-hidden="true"
          className="rounded-pill bg-danger-strong h-1.5 w-1.5"
        />
        API unreachable
      </span>
    )
  }

  return (
    <span className="rounded-pill bg-success-soft text-success-strong inline-flex items-center gap-1.5 px-3 py-1 text-sm">
      <span
        aria-hidden="true"
        className="rounded-pill bg-success-strong h-1.5 w-1.5"
      />
      API: {data.status}
    </span>
  )
}
