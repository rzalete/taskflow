import { Icon } from "./Icon"

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this. Check your connection and try again.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="border-line rounded-card flex flex-col items-center justify-center border px-6 py-10 text-center">
      <span className="text-danger-strong flex h-12 w-12 items-center justify-center">
        <Icon name="alert" size={28} />
      </span>
      <h3 className="text-ink text-h3 mt-2 font-semibold">{title}</h3>
      <p className="text-ink-muted mt-1 max-w-sm text-sm">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-control border-line-strong bg-surface hover:bg-canvas mt-4 inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-medium shadow-sm"
        >
          <Icon name="retry" size={16} />
          Try again
        </button>
      ) : null}
    </div>
  )
}
