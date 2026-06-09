import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"

import { ToastContext, type Toast, type ToastType } from "./toast-context"
import { Toaster } from "./Toaster"

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const api = useMemo(() => {
    function push(type: ToastType, message: string) {
      const id = nextId.current++
      setToasts((current) => [...current, { id, type, message }])
    }
    return {
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
    }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
