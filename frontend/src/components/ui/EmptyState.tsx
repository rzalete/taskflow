import type { ReactNode } from "react"

import { Icon, type IconName } from "./Icon"

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconName
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="border-line rounded-card flex flex-col items-center justify-center border border-dashed px-6 py-12 text-center">
      <span className="bg-well text-ink-muted flex h-12 w-12 items-center justify-center rounded-full">
        <Icon name={icon} size={24} />
      </span>
      <h3 className="text-ink text-h3 mt-4 font-semibold">{title}</h3>
      {description ? (
        <p className="text-ink-muted mt-1 max-w-sm text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
