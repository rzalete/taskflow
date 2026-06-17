import { useAuth } from "../auth/auth-context"

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-display text-ink font-bold">
        Welcome back, {user?.full_name ?? "there"}
      </h1>
      <p className="text-ink-muted mt-2">
        Pick a team from the sidebar to open its projects, or create a new team.
      </p>
    </div>
  )
}
