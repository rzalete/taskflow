import { createContext, useContext } from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

/** localStorage key for the persisted preference. Must match the boot script
 * in index.html. */
export const THEME_STORAGE_KEY = "taskflow-theme"

export interface ThemeContextValue {
  /** The user's chosen preference. */
  theme: Theme
  /** The theme actually applied right now ("system" resolved against the OS). */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
