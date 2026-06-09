import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "./ToastProvider"
import { useToast } from "./toast-context"

function ToastProbe() {
  const toast = useToast()
  return (
    <button onClick={() => toast.success("Saved successfully")}>Trigger</button>
  )
}

describe("ToastProvider", () => {
  it("shows a toast and dismisses it on click", async () => {
    render(
      <ToastProvider>
        <ToastProbe />
      </ToastProvider>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }))
    expect(await screen.findByText("Saved successfully")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }))
    await waitFor(() =>
      expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument(),
    )
  })
})
