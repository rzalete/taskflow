import { useHealth } from "./useHealth"

export function HealthStatus() {
  const { data, isPending, isError } = useHealth()

  if (isPending) {
    return (
      <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-600">
        Checking API…
      </span>
    )
  }

  if (isError) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
        API unreachable
      </span>
    )
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
      API: {data.status}
    </span>
  )
}
