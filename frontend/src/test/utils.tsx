import { type ReactNode } from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "../components/toast/ToastProvider"
import { ThemeProvider } from "../features/theme/ThemeProvider"

export function renderWithProviders(
  ui: ReactNode,
  { route = "/" }: { route?: string } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}
