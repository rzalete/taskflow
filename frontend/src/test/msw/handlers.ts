import { http, HttpResponse } from "msw"

const API = "http://localhost:8000"

const user = { id: 1, email: "ali@example.com", full_name: "Ali Reza" }

const teams = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
]

type MockProject = {
  id: number
  name: string
  description: string | null
  team_id: number
}

const initialProjects: MockProject[] = [
  { id: 1, name: "Website redesign", description: null, team_id: 1 },
]

let projects: MockProject[] = [...initialProjects]

export function resetMockData() {
  projects = [...initialProjects]
}

export const handlers = [
  http.get(`${API}/health`, () => HttpResponse.json({ status: "ok" })),

  http.get(`${API}/auth/me`, () => HttpResponse.json(user)),
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({ access_token: "valid-token", token_type: "bearer" }),
  ),
  http.post(`${API}/auth/register`, () =>
    HttpResponse.json(user, { status: 201 }),
  ),

  http.get(`${API}/teams`, () => HttpResponse.json(teams)),
  http.get(`${API}/teams/:teamId`, ({ params }) => {
    const team = teams.find((t) => t.id === Number(params.teamId))
    return team
      ? HttpResponse.json(team)
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/teams`, async ({ request }) => {
    const body = (await request.json()) as { name: string }
    return HttpResponse.json(
      { id: teams.length + 1, name: body.name },
      { status: 201 },
    )
  }),

  http.get(`${API}/teams/:teamId/projects`, ({ params }) =>
    HttpResponse.json(
      projects.filter((p) => p.team_id === Number(params.teamId)),
    ),
  ),
  http.post(`${API}/teams/:teamId/projects`, async ({ params, request }) => {
    const body = (await request.json()) as {
      name: string
      description?: string
    }
    const project = {
      id: projects.length + 1,
      name: body.name,
      description: body.description ?? null,
      team_id: Number(params.teamId),
    }
    projects = [...projects, project]
    return HttpResponse.json(project, { status: 201 })
  }),
]
