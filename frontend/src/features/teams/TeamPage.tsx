import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router"
import { isAxiosError } from "axios"

import { useTeam } from "./useTeams"
import { useCreateProject, useProjects } from "../projects/useProjects"
import { MembersSection } from "./MembersSection"
import { useToast } from "../../components/toast/toast-context"

export function TeamPage() {
  const { teamId } = useParams()
  const id = Number(teamId)

  const teamQuery = useTeam(id)
  const projectsQuery = useProjects(id)
  const createProject = useCreateProject(id)

  const [name, setName] = useState("")

  const toast = useToast()

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await createProject.mutateAsync({ name })
      setName("")
      toast.success("Project created")
    } catch (err) {
      toast.error(
        isAxiosError(err) && err.response?.status === 403
          ? "Only team owners and admins can create projects."
          : "Something went wrong. Please try again.",
      )
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {teamQuery.data?.name ?? "Team"}
      </h1>

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
          Projects
        </h2>

        {projectsQuery.isPending && (
          <p className="mt-2 text-sm text-slate-400">Loading…</p>
        )}
        {projectsQuery.isError && (
          <p className="mt-2 text-sm text-red-600">Couldn't load projects.</p>
        )}
        {projectsQuery.data?.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            No projects yet. Create the first one below.
          </p>
        )}

        <ul className="mt-3 space-y-2">
          {projectsQuery.data?.map((project) => (
            <li key={project.id}>
              <Link
                to={`/teams/${id}/projects/${project.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm"
              >
                <p className="font-medium text-slate-900">{project.name}</p>
                {project.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {project.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleCreate} className="mt-6 flex items-start gap-2">
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New project name"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={createProject.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          Add
        </button>
      </form>

      <MembersSection teamId={id} />
    </div>
  )
}
