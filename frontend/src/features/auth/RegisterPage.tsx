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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Start organizing your work with Taskflow.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
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

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}
