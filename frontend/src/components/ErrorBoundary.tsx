import { Component, type ReactNode } from "react"

import { ErrorState } from "./ui/ErrorState"

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <ErrorState
            title="This screen hit an error"
            description="The page ran into a problem and couldn't finish loading. Reloading usually clears it."
            onRetry={this.handleReload}
          />
        </div>
      )
    }
    return this.props.children
  }
}
