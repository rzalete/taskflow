import { useSyncExternalStore } from "react"

/**
 * Tracks the user's prefers-reduced-motion setting and re-renders when it
 * changes. Built on useSyncExternalStore so there is no mount effect that
 * writes state, which keeps it correct under React 19 strict mode and our
 * react-hooks lint rules.
 *
 * The global guard in index.css already neutralizes CSS animations. This hook
 * lets components make the same decision in JavaScript, for example to skip a
 * per-item stagger delay or to render a route without its enter animation.
 */
const QUERY = "(prefers-reduced-motion: reduce)"

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

// The server never animates, so report reduced motion during hydration.
function getServerSnapshot(): boolean {
  return true
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
