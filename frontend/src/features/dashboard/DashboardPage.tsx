import { useAuth } from "../auth/auth-context"
import { HealthStatus } from "../health/HealthStatus"

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-lg font-bold text-slate-900">Taskflow</span>
        <div className="flex items-center gap-4">
          <HealthStatus />
          <button
            onClick={logout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome, {user?.full_name ?? "there"} 👋
        </h1>
        <p className="mt-2 text-slate-500">
          You're signed in. Teams, projects, and your board are coming next.
        </p>
      </main>
    </div>
  )
}
