import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { isAxiosError } from "axios"

import { useAuth } from "./auth-context"
import { Button } from "../../components/ui/Button"
import { Field } from "../../components/ui/Field"

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register({ email, password, full_name: fullName })
      navigate("/", { replace: true })
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 400
          ? "An account with that email already exists."
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
            <h1 className="text-h1 text-ink font-bold">Create your account</h1>
            <p className="text-ink-muted text-sm">
              Start organizing your work with Taskflow.
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
          id="fullName"
          label="Full name"
          type="text"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />

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
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-ink-muted text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-ink font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}
