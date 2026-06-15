import { Link } from "react-router"

import { FOOTER_COLUMNS } from "./marketing-content"

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-line bg-surface border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-ink flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
            >
              <span className="bg-brand-gradient shadow-brand flex h-8 w-8 items-center justify-center rounded-[10px] text-sm font-bold text-white">
                T
              </span>
              Taskflow
            </Link>
            <p className="text-ink-muted mt-4 max-w-xs text-sm/6">
              One shared place for small teams to plan and track their work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-ink text-sm font-semibold">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link
                          to={link.href}
                          className="text-ink-muted hover:text-ink text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-ink-muted hover:text-ink text-sm transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-line text-ink-faint mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm sm:flex-row">
          <p>© {year} Taskflow. All rights reserved.</p>
          <p>Built with care for small teams.</p>
        </div>
      </div>
    </footer>
  )
}
