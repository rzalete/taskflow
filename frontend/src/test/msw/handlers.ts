import { http, HttpResponse } from "msw"

const API = "http://localhost:8000"

const user = {
  id: 1,
  email: "ali@example.com",
  full_name: "Ali Reza",
}

export const handlers = [
  http.get(`${API}/auth/me`, () => HttpResponse.json(user)),
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({ access_token: "valid-token", token_type: "bearer" }),
  ),
  http.post(`${API}/auth/register`, () =>
    HttpResponse.json(user, { status: 201 }),
  ),
]
