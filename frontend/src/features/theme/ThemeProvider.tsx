import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type Theme,
} from "./theme-context"

const THEMES: Theme[] = ["light", "dark", "system"]

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as string[]).includes(value)
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {
    // Access to localStorage can throw (private mode / disabled storage).
  }
  return "system"
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") return systemPrefersDark() ? "dark" : "light"
  return theme
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  )

  // Apply the chosen theme whenever it changes.
  useEffect(() => {
    const resolved = resolveTheme(theme)
    applyResolvedTheme(resolved)
    setResolvedTheme(resolved)
  }, [theme])

  // While following the system, re-resolve as the OS preference changes live.
  useEffect(() => {
    if (theme !== "system") return
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const resolved: ResolvedTheme = media.matches ? "dark" : "light"
      applyResolvedTheme(resolved)
      setResolvedTheme(resolved)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore persistence failures; in-memory state still applies.
    }
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
