import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { isAxiosError } from "axios"

import { useAuth } from "./auth-context"
import { Button } from "../../components/ui/Button"
import { Field } from "../../components/ui/Field"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/app"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-card border-line bg-surface shadow-card w-full max-w-sm space-y-5 border p-8"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="bg-brand-gradient shadow-brand rounded-card flex h-11 w-11 items-center justify-center text-lg font-bold text-white">
            T
          </span>
          <div className="space-y-1">
            <h1 className="text-h1 text-ink font-bold">Welcome back</h1>
            <p className="text-ink-muted text-sm">
              Sign in to your Taskflow account.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-control bg-danger-soft text-danger-strong px-3 py-2 text-sm"
          >
            {error}
          </p>
        )}

        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-ink-muted text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-ink font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  )
}
