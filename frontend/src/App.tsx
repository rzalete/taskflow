import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router"

import { AppLayout } from "./components/AppLayout"
import { RouteFallback } from "./components/RouteFallback"
import { RouteTransition } from "./components/RouteTransition"
import { ProtectedRoute } from "./features/auth/ProtectedRoute"

const LandingPage = lazy(() =>
  import("./features/marketing/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
)
const LoginPage = lazy(() =>
  import("./features/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import("./features/auth/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
)
const DashboardPage = lazy(() =>
  import("./features/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
)
const NewTeamPage = lazy(() =>
  import("./features/teams/NewTeamPage").then((m) => ({
    default: m.NewTeamPage,
  })),
)
const TeamPage = lazy(() =>
  import("./features/teams/TeamPage").then((m) => ({ default: m.TeamPage })),
)
const ProjectBoardPage = lazy(() =>
  import("./features/tasks/ProjectBoardPage").then((m) => ({
    default: m.ProjectBoardPage,
  })),
)

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public marketing surface */}
        <Route
          path="/"
          element={
            <RouteTransition>
              <LandingPage />
            </RouteTransition>
          }
        />
        <Route
          path="/login"
          element={
            <RouteTransition>
              <LoginPage />
            </RouteTransition>
          }
        />
        <Route
          path="/register"
          element={
            <RouteTransition>
              <RegisterPage />
            </RouteTransition>
          }
        />

        {/* Authenticated application shell, mounted under /app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/teams/new" element={<NewTeamPage />} />
            <Route path="/app/teams/:teamId" element={<TeamPage />} />
            <Route
              path="/app/teams/:teamId/projects/:projectId"
              element={<ProjectBoardPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
