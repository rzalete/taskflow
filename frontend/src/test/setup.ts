import "@testing-library/jest-dom/vitest"

import { afterAll, afterEach, beforeAll } from "vitest"
import { cleanup } from "@testing-library/react"

import { resetMockData } from "./msw/handlers"
import { server } from "./msw/server"

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetMockData()
  localStorage.clear()
})

afterAll(() => server.close())
