import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { useCreateTeam } from "./useTeams"

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
      <h1 className="text-2xl font-bold text-slate-900">Create a team</h1>
      <p className="mt-1 text-sm text-slate-500">
        Teams group your projects and the people you work with.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700"
          >
            Team name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        {createTeam.isError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={createTeam.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {createTeam.isPending ? "Creating…" : "Create team"}
        </button>
      </form>
    </div>
  )
}
