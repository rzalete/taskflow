import { getInitials } from "./taskFormat"

const AVATAR_COLORS = [
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
]

function colorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      title={name}
      className={`rounded-pill inline-flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-semibold ${colorFor(
        name,
      )}`}
    >
      {getInitials(name)}
    </span>
  )
}
