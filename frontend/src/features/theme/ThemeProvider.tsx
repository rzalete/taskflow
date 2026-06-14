import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type Theme,
} from "./theme-context"

const THEMES: Theme[] = ["light", "dark", "system"]
const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)"

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

// --- OS preference as an external store --------------------------------
// matchMedia is an external system, so we read it via useSyncExternalStore
// rather than mirroring it into state with a setState-in-effect (which the
// react-hooks/set-state-in-effect rule rightly forbids). React only re-renders
// through the subscription callback below — never synchronously inside an
// effect body.
function subscribeToSystemTheme(onChange: () => void): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {}
  }
  const media = window.matchMedia(PREFERS_DARK_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function getSystemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(PREFERS_DARK_QUERY).matches
  )
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  // Track the OS preference live. The server/no-match snapshot is light.
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    () => false,
  )

  // Derived during render — no effect or setState needed. "system" follows the
  // OS; an explicit choice wins.
  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme

  // The only effect: push the resolved theme onto <html>. This updates an
  // external system (the DOM) and never calls setState, so it satisfies
  // react-hooks/set-state-in-effect.
  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

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
