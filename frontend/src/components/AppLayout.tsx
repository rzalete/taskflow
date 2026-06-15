import { Suspense } from "react"
import { Link, NavLink, Outlet } from "react-router"

import { RouteFallback } from "./RouteFallback"
import { useAuth } from "../features/auth/auth-context"
import { HealthStatus } from "../features/health/HealthStatus"
import { ThemeToggle } from "../features/theme/ThemeToggle"
import { useTeams } from "../features/teams/useTeams"

// Build up to two initials from a full name for the avatar chip.
function initials(name: string | undefined) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + last).toUpperCase() || "?"
}

// Deterministic soft tint for each team glyph, hashed off the team name.
// Translucent fills + a lighter foreground in dark keep these legible on both
// themes without a separate dark palette.
const TEAM_TINTS = [
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
]

function tintFor(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return TEAM_TINTS[Math.abs(hash) % TEAM_TINTS.length]!
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "group relative flex items-center gap-2.5 rounded-control px-2.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-soft text-brand-accent"
      : "text-ink-muted hover:bg-well hover:text-ink",
  ].join(" ")
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const teamsQuery = useTeams()

  return (
    <div className="bg-canvas text-ink flex min-h-screen">
      <aside className="bg-surface/70 border-line flex w-64 shrink-0 flex-col border-r backdrop-blur-sm">
        <div className="px-5 py-5">
          <Link
            to="/app"
            className="text-ink flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
          >
            <span className="bg-brand-gradient shadow-brand flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold text-white">
              T
            </span>
            Taskflow
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="text-ink-faint px-2.5 pb-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase">
            Teams
          </p>

          {teamsQuery.isPending && (
            <p className="text-ink-faint px-2.5 py-2 text-sm">Loading…</p>
          )}
          {teamsQuery.isError && (
            <p className="text-danger-strong px-2.5 py-2 text-sm">
              Couldn't load teams.
            </p>
          )}
          {teamsQuery.data?.length === 0 && (
            <p className="text-ink-faint px-2.5 py-2 text-sm">No teams yet.</p>
          )}

          <div className="space-y-0.5">
            {teamsQuery.data?.map((team) => (
              <NavLink
                key={team.id}
                to={`/app/teams/${team.id}`}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={[
                        "rounded-pill absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 transition-colors",
                        isActive ? "bg-brand-600" : "bg-transparent",
                      ].join(" ")}
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${tintFor(
                        team.name,
                      )}`}
                    >
                      {team.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <Link
            to="/app/teams/new"
            className="text-brand-accent hover:bg-brand-soft rounded-control mt-2 flex items-center gap-2 px-2.5 py-2 text-sm font-medium transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M10 4.5v11M4.5 10h11"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            New team
          </Link>
        </nav>

        <div className="border-line border-t p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <span className="bg-brand-soft text-brand-accent rounded-pill flex h-8 w-8 shrink-0 items-center justify-center text-xs font-semibold">
              {initials(user?.full_name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-ink truncate text-sm font-medium">
                {user?.full_name}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-control text-ink-faint hover:bg-well hover:text-ink p-1.5 transition-colors"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M13 14.5v.5A1.5 1.5 0 0 1 11.5 16.5h-5A1.5 1.5 0 0 1 5 15V5A1.5 1.5 0 0 1 6.5 3.5h5A1.5 1.5 0 0 1 13 5v.5M9 10h7m0 0-2.5-2.5M16 10l-2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="bg-surface/70 border-line sticky top-0 z-10 flex items-center justify-end gap-3 border-b px-6 py-3 backdrop-blur-md">
          <ThemeToggle />
          <HealthStatus />
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="animate-fade-in-up mx-auto w-full max-w-7xl">
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
