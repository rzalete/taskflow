import { beforeEach, describe, expect, it } from "vitest"

import { clearToken, getToken, setToken } from "./token"

describe("token storage", () => {
  beforeEach(() => localStorage.clear())

  it("returns null when no token is stored", () => {
    expect(getToken()).toBeNull()
  })

  it("persists and reads back a token", () => {
    setToken("abc.123")
    expect(getToken()).toBe("abc.123")
  })

  it("clears a stored token", () => {
    setToken("abc.123")
    clearToken()
    expect(getToken()).toBeNull()
  })
})
