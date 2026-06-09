import "@testing-library/jest-dom/vitest"

import { afterAll, afterEach, beforeAll } from "vitest"
import { cleanup } from "@testing-library/react"

import { server } from "./msw/server"

// Start the mock server before any test; fail loudly on un-mocked requests.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

// Reset DOM, request handlers, and storage so tests stay isolated.
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})

afterAll(() => server.close())
