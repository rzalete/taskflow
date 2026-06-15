import { Link } from "react-router"

import { useAuth } from "../auth/auth-context"
import { ThemeToggle } from "../theme/ThemeToggle"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
]

const ctaClass =
  "rounded-control bg-brand-600 hover:bg-brand-700 shadow-brand px-3.5 py-2 text-sm font-semibold text-white transition-colors"

export function MarketingHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="border-line/80 bg-canvas/80 sticky top-0 z-20 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-ink flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
        >
          <span className="bg-brand-gradient shadow-brand flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold text-white">
            T
          </span>
          Taskflow
        </Link>

        <nav
          aria-label="Primary"
          className="text-ink-muted hidden items-center gap-7 text-sm font-medium md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/app" className={ctaClass}>
              Open app
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-control text-ink-muted hover:text-ink hidden px-3 py-2 text-sm font-medium transition-colors sm:inline-flex"
              >
                Sign in
              </Link>
              <Link to="/register" className={ctaClass}>
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
