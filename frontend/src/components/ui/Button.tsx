import { type ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type ButtonSize = "sm" | "md"

// `primary` keeps `bg-brand-600` and `danger` keeps `bg-red-600` (asserted by
// Button.test); the premium feel comes from layered shadow + ring + press.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-brand hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "border border-line-strong bg-surface text-ink-muted shadow-sm hover:border-ink-faint/60 hover:bg-well hover:text-ink",
  danger:
    "bg-red-600 text-white shadow-sm ring-1 ring-white/15 ring-inset hover:bg-red-700 active:bg-red-800",
  ghost: "text-ink-muted hover:bg-well hover:text-ink",
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  type = "button",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "rounded-control relative inline-flex items-center justify-center font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 will-change-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 disabled:active:scale-100",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="absolute h-4 w-4 animate-spin"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          <path
            d="M14 8a6 6 0 0 0-6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className={loading ? "invisible" : "contents"}>{children}</span>
    </button>
  )
}
