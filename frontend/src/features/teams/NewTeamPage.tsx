import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { useCreateTeam } from "./useTeams"
import { Button } from "../../components/ui/Button"

export function NewTeamPage() {
  const navigate = useNavigate()
  const createTeam = useCreateTeam()
  const [name, setName] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const team = await createTeam.mutateAsync({ name })
    navigate(`/teams/${team.id}`)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-h1 text-ink font-bold">Create a team</h1>
      <p className="text-ink-muted mt-1 text-sm">
        Teams group your projects and the people you work with.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-ink-muted block text-sm font-medium"
          >
            Team name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-control border-line-strong bg-surface focus:border-brand-500 w-full border px-3 py-2 text-sm shadow-sm focus:outline-none"
          />
        </div>

        {createTeam.isError && (
          <p className="rounded-control bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong. Please try again.
          </p>
        )}

        <Button type="submit" disabled={createTeam.isPending}>
          {createTeam.isPending ? "Creating…" : "Create team"}
        </Button>
      </form>
    </div>
  )
}
