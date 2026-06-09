import { Navigate, Route, Routes } from "react-router"

import { AppLayout } from "./components/AppLayout"
import { LoginPage } from "./features/auth/LoginPage"
import { ProtectedRoute } from "./features/auth/ProtectedRoute"
import { RegisterPage } from "./features/auth/RegisterPage"
import { DashboardPage } from "./features/dashboard/DashboardPage"
import { NewTeamPage } from "./features/teams/NewTeamPage"
import { TeamPage } from "./features/teams/TeamPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/teams/new" element={<NewTeamPage />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
