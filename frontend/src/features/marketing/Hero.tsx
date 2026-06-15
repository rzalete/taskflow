import { Link } from "react-router"

import { STATS } from "./marketing-content"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="bg-brand-500/20 rounded-pill h-[32rem] w-[32rem] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-line bg-surface text-ink-muted animate-fade-in-up rounded-pill inline-flex items-center gap-2 border px-3 py-1 text-xs font-medium">
            <span className="bg-success-strong rounded-pill h-1.5 w-1.5" />
            Built for small teams that ship
          </span>
          <h1 className="text-ink animate-fade-in-up mt-6 text-4xl font-semibold tracking-tight text-balance [animation-delay:60ms] sm:text-5xl lg:text-6xl">
            Keep your team's projects on one board
          </h1>
          <p className="text-ink-muted animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg/8 text-pretty [animation-delay:120ms]">
            Taskflow gives small teams one place to plan, assign, and track
            their work. Use a kanban board or a simple list, and nothing gets
            lost between tools.
          </p>
          <div className="animate-fade-in-up mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
            <Link
              to="/register"
              className="rounded-control bg-brand-600 hover:bg-brand-700 shadow-brand w-full px-6 py-3 text-base font-semibold text-white transition-colors sm:w-auto"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="rounded-control border-line bg-surface text-ink hover:bg-well w-full border px-6 py-3 text-base font-semibold transition-colors sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="animate-fade-in-up mx-auto mt-16 max-w-5xl [animation-delay:240ms]">
          <div className="border-line bg-surface shadow-card-hover rounded-card overflow-hidden border">
            <div className="border-line bg-canvas flex items-center gap-1.5 border-b px-4 py-3">
              <span className="bg-danger-strong/70 rounded-pill h-3 w-3" />
              <span className="bg-warning-strong/70 rounded-pill h-3 w-3" />
              <span className="bg-success-strong/70 rounded-pill h-3 w-3" />
              <span className="text-ink-faint ml-3 text-xs">
                Website redesign board
              </span>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {["Backlog", "In progress", "Done"].map((col, columnIndex) => (
                <div key={col} className="bg-well/60 rounded-control p-3">
                  <p className="text-ink-muted mb-3 text-xs font-semibold tracking-wide uppercase">
                    {col}
                  </p>
                  <div className="space-y-2.5">
                    {Array.from({ length: 3 - columnIndex }).map(
                      (_, cardIndex) => (
                        <div
                          key={cardIndex}
                          className="border-line bg-surface rounded-control border p-3 shadow-sm"
                        >
                          <div className="bg-ink/10 rounded-pill h-2 w-3/4" />
                          <div className="mt-2 flex items-center gap-2">
                            <span className="bg-brand-500/70 rounded-pill h-4 w-12" />
                            <span className="bg-ink/10 rounded-pill h-4 w-4" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <dl className="border-line bg-line rounded-card mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden border sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-6 text-center">
              <dt className="text-ink text-2xl font-semibold tracking-tight">
                {stat.value}
              </dt>
              <dd className="text-ink-muted mt-1 text-sm">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
