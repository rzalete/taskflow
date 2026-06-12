// A placeholder that mirrors a TaskCard's silhouette while the board's tasks
// load. Purely presentational and aria-hidden, so assistive tech skips it.
export function TaskCardSkeleton() {
  return (
    <div
      data-testid="task-skeleton"
      aria-hidden="true"
      className="rounded-card shadow-card border border-l-4 border-slate-200 bg-white p-3"
    >
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  )
}
