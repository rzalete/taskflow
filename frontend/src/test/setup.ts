import "@testing-library/jest-dom/vitest"

import { afterAll, afterEach, beforeAll, vi } from "vitest"
import { cleanup } from "@testing-library/react"

import { resetMockData } from "./msw/handlers"
import { server } from "./msw/server"

// jsdom doesn't implement matchMedia; the theme system depends on it. Provide a
// light-by-default stub exposing the full MediaQueryList surface.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetMockData()
  localStorage.clear()
  // Reset any theme class applied to <html> between tests.
  document.documentElement.classList.remove("dark")
})

afterAll(() => server.close())
