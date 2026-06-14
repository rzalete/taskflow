// A placeholder that mirrors a TaskCard's silhouette while the board's tasks
// load. Purely presentational and aria-hidden, so assistive tech skips it.
export function TaskCardSkeleton() {
  return (
    <div
      data-testid="task-skeleton"
      aria-hidden="true"
      className="rounded-card shadow-card border-line bg-surface border border-l-4 p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="skeleton-shimmer h-4 w-3/4 rounded" />
        <div className="skeleton-shimmer h-4 w-4 shrink-0 rounded" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer h-3 w-12 rounded" />
          <div className="skeleton-shimmer h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  )
}
