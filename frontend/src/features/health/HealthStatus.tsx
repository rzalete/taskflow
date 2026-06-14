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
      <span className="rounded-pill inline-flex items-center gap-1.5 bg-red-100 px-3 py-1 text-sm text-red-700">
        <span
          aria-hidden="true"
          className="rounded-pill h-1.5 w-1.5 bg-red-500"
        />
        API unreachable
      </span>
    )
  }

  return (
    <span className="rounded-pill inline-flex items-center gap-1.5 bg-green-100 px-3 py-1 text-sm text-green-700">
      <span
        aria-hidden="true"
        className="rounded-pill h-1.5 w-1.5 bg-green-500"
      />
      API: {data.status}
    </span>
  )
}
