import { Link, NavLink, Outlet } from "react-router"

import { useAuth } from "../features/auth/auth-context"
import { HealthStatus } from "../features/health/HealthStatus"
import { useTeams } from "../features/teams/useTeams"

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-md px-2 py-1.5 text-sm font-medium",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ")
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const teamsQuery = useTeams()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-4">
          <Link to="/" className="text-lg font-bold text-slate-900">
            Taskflow
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Teams
          </p>

          {teamsQuery.isPending && (
            <p className="px-2 text-sm text-slate-400">Loading…</p>
          )}
          {teamsQuery.isError && (
            <p className="px-2 text-sm text-red-600">Couldn't load teams.</p>
          )}
          {teamsQuery.data?.length === 0 && (
            <p className="px-2 text-sm text-slate-400">No teams yet.</p>
          )}

          {teamsQuery.data?.map((team) => (
            <NavLink
              key={team.id}
              to={`/teams/${team.id}`}
              className={navLinkClass}
            >
              {team.name}
            </NavLink>
          ))}

          <Link
            to="/teams/new"
            className="mt-2 block rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            + New team
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <HealthStatus />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.full_name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
