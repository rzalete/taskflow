import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router"
import { isAxiosError } from "axios"

import { useTeam } from "./useTeams"
import { useCreateProject, useProjects } from "../projects/useProjects"
import { MembersSection } from "./MembersSection"
import { useToast } from "../../components/toast/toast-context"
import { Button } from "../../components/ui/Button"

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
      <h1 className="text-h1 text-ink font-bold">
        {teamQuery.data?.name ?? "Team"}
      </h1>

      <section className="mt-6">
        <h2 className="text-ink-faint text-sm font-semibold tracking-wide uppercase">
          Projects
        </h2>

        {projectsQuery.isPending && (
          <p className="text-ink-faint mt-2 text-sm">Loading…</p>
        )}
        {projectsQuery.isError && (
          <p className="text-danger-strong mt-2 text-sm">
            Couldn't load projects.
          </p>
        )}
        {projectsQuery.data?.length === 0 && (
          <p className="text-ink-muted mt-2 text-sm">
            No projects yet. Create the first one below.
          </p>
        )}

        <ul className="mt-3 space-y-2">
          {projectsQuery.data?.map((project) => (
            <li key={project.id}>
              <Link
                to={`/teams/${id}/projects/${project.id}`}
                className="rounded-card border-line bg-surface hover:border-line-strong hover:shadow-card block border p-4"
              >
                <p className="text-ink font-medium">{project.name}</p>
                {project.description && (
                  <p className="text-ink-muted mt-1 text-sm">
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
          className="rounded-control border-line-strong bg-surface placeholder:text-ink-faint focus:border-brand-500 flex-1 border px-3 py-2 text-sm shadow-sm focus:outline-none"
        />
        <Button type="submit" disabled={createProject.isPending}>
          Add
        </Button>
      </form>

      <MembersSection teamId={id} />
    </div>
  )
}
