import { type ButtonHTMLAttributes, type ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type ButtonSize = "sm" | "md"

// Variants are built on the shared design tokens (brand ramp + elevation).
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
