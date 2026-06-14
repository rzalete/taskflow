import { useAuth } from "../auth/auth-context"

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-display text-ink font-bold">
        Welcome, {user?.full_name ?? "there"} 👋
      </h1>
      <p className="text-ink-muted mt-2">
        Select a team from the sidebar, or create one to get started.
      </p>
    </div>
  )
}
