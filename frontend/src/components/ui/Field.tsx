import { type InputHTMLAttributes } from "react"

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export function Field({
  id,
  label,
  error,
  className = "",
  ...props
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-ink-muted block text-[13px] font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "rounded-control bg-surface text-ink placeholder:text-ink-faint w-full border px-3.5 py-2.5 text-sm shadow-sm transition-[color,border-color,box-shadow] focus:ring-4 focus:outline-none",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-line-strong focus:border-brand-500 focus:ring-brand-500/15",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-danger-strong text-[13px]">
          {error}
        </p>
      )}
    </div>
  )
}
