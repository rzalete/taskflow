import { Link } from "react-router"

import { Icon } from "../../components/ui/Icon"

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="bg-well text-ink-muted flex h-14 w-14 items-center justify-center rounded-full">
        <Icon name="compass" size={28} />
      </span>
      <h1 className="text-display text-ink mt-6 font-bold">Page not found</h1>
      <p className="text-ink-muted mt-2">
        The page you're looking for moved or never existed. Check the address,
        or head back to a page you know.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/"
          className="rounded-control bg-brand-600 shadow-brand hover:bg-brand-700 inline-flex items-center px-4 py-2 text-sm font-medium text-white"
        >
          Back to home
        </Link>
        <Link
          to="/app"
          className="rounded-control border-line-strong bg-surface text-ink-muted hover:bg-well hover:text-ink inline-flex items-center border px-4 py-2 text-sm font-medium shadow-sm"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  )
}
