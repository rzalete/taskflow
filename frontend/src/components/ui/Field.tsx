import { type InputHTMLAttributes, type ReactNode } from "react"

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: ReactNode
  error?: string
}

export function Field({
  id,
  label,
  error,
  className = "",
  ...props
}: FieldProps) {
  const inputClasses = [
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none",
    error
      ? "border-red-400 focus:border-red-500"
      : "border-slate-300 focus:border-slate-500",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
