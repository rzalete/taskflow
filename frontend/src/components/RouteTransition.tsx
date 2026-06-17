import { type ReactNode } from "react"
import { useLocation } from "react-router"

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

/**
 * Plays a short enter animation whenever the route changes.
 *
 * Keying the wrapper on the current pathname remounts the inner element on each
 * navigation, which replays the `fade-in-up` animation for the new page. Only
 * the content this wraps animates, so placing it around the router Outlet keeps
 * the persistent app chrome (sidebar, header) still. When the user prefers
 * reduced motion we render the same markup without the animation class.
 */
export function RouteTransition({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()
  const motionClass = reduced ? "" : "animate-fade-in-up"

  return (
    <div
      key={location.pathname}
      className={[motionClass, className].join(" ").trim()}
    >
      {children}
    </div>
  )
}
