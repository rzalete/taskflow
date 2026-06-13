import { Suspense } from "react"
import { Link, NavLink, Outlet } from "react-router"

import { RouteFallback } from "./RouteFallback"
import { Button } from "./ui/Button"
import { useAuth } from "../features/auth/auth-context"
import { HealthStatus } from "../features/health/HealthStatus"
import { useTeams } from "../features/teams/useTeams"

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ")
}

// Build up to two initials from a full name for the header avatar chip.
function initials(name: string | undefined) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + last).toUpperCase() || "?"
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const teamsQuery = useTeams()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
          >
            <span className="bg-brand-600 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm">
              T
            </span>
            Taskflow
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Teams
          </p>

          {teamsQuery.isPending && (
            <p className="px-3 text-sm text-slate-400">Loading…</p>
          )}
          {teamsQuery.isError && (
            <p className="px-3 text-sm text-red-600">Couldn't load teams.</p>
          )}
          {teamsQuery.data?.length === 0 && (
            <p className="px-3 text-sm text-slate-400">No teams yet.</p>
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
            className="text-brand-600 hover:bg-brand-50 mt-2 block rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            + New team
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <HealthStatus />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {initials(user?.full_name)}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {user?.full_name}
              </span>
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
