import { useAuth } from "../auth/auth-context"

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Welcome, {user?.full_name ?? "there"} 👋
      </h1>
      <p className="mt-2 text-slate-500">
        Select a team from the sidebar, or create one to get started.
      </p>
    </div>
  )
}
