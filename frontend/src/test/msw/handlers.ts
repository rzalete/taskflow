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

type MockTask = {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  project_id: number
  assignee_id: number | null
}

const initialTasks: MockTask[] = [
  {
    id: 1,
    title: "Set up CI",
    description: null,
    status: "todo",
    priority: "high",
    due_date: null,
    project_id: 1,
    assignee_id: null,
  },
  {
    id: 2,
    title: "Design schema",
    description: null,
    status: "done",
    priority: "medium",
    due_date: null,
    project_id: 1,
    assignee_id: null,
  },
]

let projects: MockProject[] = [...initialProjects]
let tasks: MockTask[] = [...initialTasks]

export function resetMockData() {
  projects = [...initialProjects]
  tasks = [...initialTasks]
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
  http.get(`${API}/teams/:teamId/projects/:projectId`, ({ params }) => {
    const project = projects.find((p) => p.id === Number(params.projectId))
    return project
      ? HttpResponse.json(project)
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/teams/:teamId/projects`, async ({ params, request }) => {
    const body = (await request.json()) as {
      name: string
      description?: string
    }
    const project: MockProject = {
      id: projects.length + 1,
      name: body.name,
      description: body.description ?? null,
      team_id: Number(params.teamId),
    }
    projects = [...projects, project]
    return HttpResponse.json(project, { status: 201 })
  }),

  http.get(`${API}/teams/:teamId/projects/:projectId/tasks`, ({ params }) =>
    HttpResponse.json(
      tasks.filter((t) => t.project_id === Number(params.projectId)),
    ),
  ),
  http.post(
    `${API}/teams/:teamId/projects/:projectId/tasks`,
    async ({ params, request }) => {
      const body = (await request.json()) as {
        title: string
        status?: string
        priority?: string
      }
      const task: MockTask = {
        id: tasks.length + 1,
        title: body.title,
        description: null,
        status: body.status ?? "backlog",
        priority: body.priority ?? "medium",
        due_date: null,
        project_id: Number(params.projectId),
        assignee_id: null,
      }
      tasks = [...tasks, task]
      return HttpResponse.json(task, { status: 201 })
    },
  ),
  http.patch(
    `${API}/teams/:teamId/projects/:projectId/tasks/:taskId`,
    async ({ params, request }) => {
      const body = (await request.json()) as Record<string, unknown>
      tasks = tasks.map((t) =>
        t.id === Number(params.taskId) ? { ...t, ...body } : t,
      )
      const updated = tasks.find((t) => t.id === Number(params.taskId))
      return HttpResponse.json(updated)
    },
  ),
]
