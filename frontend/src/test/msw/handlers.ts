import { http, HttpResponse } from "msw"

const API = "http://localhost:8000"

const user = { id: 1, email: "ali@example.com", full_name: "Ali Reza" }

const teams = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
]

const userDirectory = [
  { user_id: 1, email: "ali@example.com", full_name: "Ali Reza" },
  { user_id: 2, email: "sam@example.com", full_name: "Sam Lee" },
  { user_id: 3, email: "riya@example.com", full_name: "Riya Patel" },
]

type MockMember = {
  user_id: number
  email: string
  full_name: string
  role: "owner" | "admin" | "member"
}

const initialMembers: MockMember[] = [
  {
    user_id: 1,
    email: "ali@example.com",
    full_name: "Ali Reza",
    role: "owner",
  },
  {
    user_id: 2,
    email: "sam@example.com",
    full_name: "Sam Lee",
    role: "member",
  },
]

let members: MockMember[] = [...initialMembers]

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
  position: number
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
    assignee_id: 1,
    position: 0,
  },
  {
    id: 2,
    title: "Design schema",
    description: null,
    status: "done",
    priority: "medium",
    due_date: null,
    project_id: 1,
    assignee_id: 2,
    position: 0,
  },
]

let projects: MockProject[] = [...initialProjects]
let tasks: MockTask[] = [...initialTasks]

export function resetMockData() {
  projects = [...initialProjects]
  tasks = [...initialTasks]
  members = [...initialMembers]
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

  http.get(`${API}/teams/:teamId/members`, () => HttpResponse.json(members)),

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
      tasks
        .filter((t) => t.project_id === Number(params.projectId))
        .sort((a, b) => a.position - b.position || a.id - b.id),
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
      const status = body.status ?? "backlog"
      const last = tasks
        .filter(
          (t) =>
            t.project_id === Number(params.projectId) && t.status === status,
        )
        .reduce((max, t) => Math.max(max, t.position), -1)
      const task: MockTask = {
        id: tasks.length + 1,
        title: body.title,
        description: null,
        status,
        priority: body.priority ?? "medium",
        due_date: null,
        project_id: Number(params.projectId),
        assignee_id: null,
        position: last + 1,
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
  http.patch(
    `${API}/teams/:teamId/projects/:projectId/tasks/:taskId/move`,
    async ({ params, request }) => {
      const body = (await request.json()) as {
        status: string
        position: number
      }
      const taskId = Number(params.taskId)
      const moved = tasks.find((t) => t.id === taskId)
      if (!moved) return new HttpResponse(null, { status: 404 })

      const sourceStatus = moved.status
      moved.status = body.status

      const destination = tasks
        .filter((t) => t.status === body.status && t.id !== taskId)
        .sort((a, b) => a.position - b.position)
      const index = Math.max(0, Math.min(body.position, destination.length))
      destination.splice(index, 0, moved)
      destination.forEach((t, i) => {
        t.position = i
      })

      if (sourceStatus !== body.status) {
        tasks
          .filter((t) => t.status === sourceStatus && t.id !== taskId)
          .sort((a, b) => a.position - b.position)
          .forEach((t, i) => {
            t.position = i
          })
      }
      return HttpResponse.json(moved)
    },
  ),
  http.delete(
    `${API}/teams/:teamId/projects/:projectId/tasks/:taskId`,
    ({ params }) => {
      tasks = tasks.filter((t) => t.id !== Number(params.taskId))
      return new HttpResponse(null, { status: 204 })
    },
  ),
  http.get(`${API}/teams/:teamId/members`, () => HttpResponse.json(members)),
  http.post(`${API}/teams/:teamId/members`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      role: MockMember["role"]
    }
    const user = userDirectory.find((u) => u.email === body.email)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    if (members.some((m) => m.user_id === user.user_id)) {
      return new HttpResponse(null, { status: 400 })
    }
    const newMember: MockMember = {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role: body.role,
    }
    members = [...members, newMember]
    return HttpResponse.json(newMember, { status: 201 })
  }),
  http.patch(
    `${API}/teams/:teamId/members/:userId`,
    async ({ params, request }) => {
      const body = (await request.json()) as { role: MockMember["role"] }
      members = members.map((m) =>
        m.user_id === Number(params.userId) ? { ...m, role: body.role } : m,
      )
      const updated = members.find((m) => m.user_id === Number(params.userId))
      return HttpResponse.json(updated)
    },
  ),
  http.delete(`${API}/teams/:teamId/members/:userId`, ({ params }) => {
    members = members.filter((m) => m.user_id !== Number(params.userId))
    return new HttpResponse(null, { status: 204 })
  }),
]
