import { api } from "../../lib/api"

export interface User {
  id: number
  email: string
  full_name: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export async function login(
  credentials: LoginCredentials,
): Promise<TokenResponse> {
  // FastAPI's OAuth2 password flow expects form-encoded "username" + "password".
  const form = new URLSearchParams()
  form.append("username", credentials.email)
  form.append("password", credentials.password)

  const { data } = await api.post<TokenResponse>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return data
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me")
  return data
}
