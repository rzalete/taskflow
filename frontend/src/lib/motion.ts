/**
 * Motion helpers shared across the app.
 *
 * One source of truth for entrance stagger timing, so the board, the list and
 * any future surface animate with the same rhythm. Components that use these
 * values already respect the global prefers-reduced-motion guard in index.css.
 * The `reduced` argument lets callers also drop the per-item delay in
 * JavaScript, so nothing waits on a timeline the user asked us to skip.
 */

// Delay added per item in a staggered group, in milliseconds.
export const STAGGER_STEP_MS = 45

// Cap the stagger so a long list never holds its last item back too far.
export const MAX_STAGGER_STEPS = 12

/**
 * Entrance delay for the item at `index` within a staggered group. Returns 0
 * when the user prefers reduced motion, so every item appears at once.
 */
export function staggerDelayMs(index: number, reduced: boolean): number {
  if (reduced || index <= 0) return 0
  return Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP_MS
}
