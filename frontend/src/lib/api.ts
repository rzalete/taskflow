import axios, { isAxiosError } from "axios"

import { clearToken, getToken } from "./token"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
})

// Attach the bearer token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, drop the now-invalid token so the app falls back to logged-out.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      clearToken()
    }
    return Promise.reject(error)
  },
)
