import { useTheme, type Theme } from "./theme-context"

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
]

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <circle
          cx="10"
          cy="10"
          r="3.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 2.5v1.5M10 16v1.5M17.5 10H16M4 10H2.5M15.3 4.7l-1.05 1.05M5.75 14.25 4.7 15.3M15.3 15.3l-1.05-1.05M5.75 5.75 4.7 4.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (theme === "dark") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <rect
        x="2.5"
        y="4"
        width="15"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 16.5h6M10 13.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="rounded-control bg-well ring-line inline-flex items-center gap-0.5 p-0.5 ring-1 ring-inset"
    >
      {OPTIONS.map((option) => {
        const active = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={active}
            title={`${option.label} theme`}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-[7px] transition-colors",
              active
                ? "bg-surface text-brand-accent shadow-sm"
                : "text-ink-faint hover:text-ink",
            ].join(" ")}
          >
            <ThemeIcon theme={option.value} />
            <span className="sr-only">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
