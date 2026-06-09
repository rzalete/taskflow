import { createContext, useContext } from "react"

export type ToastType = "success" | "error"

export interface Toast {
  id: number
  type: ToastType
  message: string
}

export interface ToastApi {
  success: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
