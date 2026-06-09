import { useCallback, useMemo, useState, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { clearToken, getToken, setToken } from "../../lib/token"
import { AuthContext, type AuthContextValue } from "./auth-context"
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  type LoginCredentials,
  type RegisterPayload,
} from "./authApi"

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setTokenState] = useState<string | null>(() => getToken())

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
  })

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { access_token } = await loginRequest(credentials)
      setToken(access_token)
      setTokenState(access_token)
      await queryClient.fetchQuery({ queryKey: ["me"], queryFn: getMe })
    },
    [queryClient],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerRequest(payload)
      // Smooth UX: log the user in immediately after registering.
      await login({ email: payload.email, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isAuthenticated: meQuery.isSuccess,
      isLoading: token !== null && meQuery.isPending,
      login,
      register,
      logout,
    }),
    [
      token,
      meQuery.data,
      meQuery.isSuccess,
      meQuery.isPending,
      login,
      register,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
