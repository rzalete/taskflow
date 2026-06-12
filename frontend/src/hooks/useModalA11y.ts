import { useEffect, useRef, type RefObject } from "react"

// Elements inside the dialog that can receive keyboard focus.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

/**
 * Accessibility behaviour shared by modal dialogs:
 * - closes the dialog when Escape is pressed
 * - traps Tab / Shift+Tab focus inside the dialog
 * - moves focus into the dialog on open and restores it to the previously
 *   focused element on close
 * - locks background page scroll while the dialog is open
 *
 * Pass a ref to the dialog container element and an onClose callback. onClose
 * is read through a ref, so it does not need to be memoised by the caller.
 */
export function useModalA11y(
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose)

  // Keep the latest onClose without re-running the main effect (which would
  // re-steal focus on every parent render). A ref must be updated inside an
  // effect, never during render.
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const container = containerRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    function getFocusable(): HTMLElement[] {
      if (!container) return []
      return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
    }

    // Move focus into the dialog when it opens.
    const initial = getFocusable()[0]
    if (initial) {
      initial.focus()
    } else {
      container?.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== "Tab") return

      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        event.preventDefault()
        return
      }

      const active = document.activeElement
      const outside = !container || !container.contains(active)

      if (event.shiftKey) {
        if (active === first || outside) {
          event.preventDefault()
          last.focus()
        }
      } else if (active === last || outside) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // Lock background scroll, remembering the previous value to restore it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [containerRef])
}
