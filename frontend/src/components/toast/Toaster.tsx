import { useEffect } from "react"

import { type Toast } from "./toast-context"

const TOAST_DURATION = 4000

const toastClass: Record<Toast["type"], string> = {
  success:
    "bg-success-soft text-success-strong ring-1 ring-inset ring-black/5 dark:ring-white/10",
  error:
    "bg-danger-soft text-danger-strong ring-1 ring-inset ring-black/5 dark:ring-white/10",
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: number) => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      className={`animate-toast-in rounded-card shadow-card-hover flex items-start gap-3 px-4 py-3 text-sm ${toastClass[toast.type]}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: number) => void
}) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed right-4 bottom-4 z-100 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
