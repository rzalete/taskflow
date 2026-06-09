import { Navigate, Outlet, useLocation } from "react-router"

import { useAuth } from "./auth-context"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    )
  }

  if (!isAuthenticated) {
    const redirectState = { from: location }
    return <Navigate to="/login" replace state={redirectState} />
  }

  return <Outlet />
}
