import { HealthStatus } from "./features/health/HealthStatus"

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-bold tracking-tight">Taskflow</h1>
      <p className="text-slate-500">Project management, done right.</p>
      <HealthStatus />
    </main>
  )
}

export default App
