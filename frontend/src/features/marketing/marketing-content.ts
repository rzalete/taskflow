// Declarative content for the marketing landing page. Keeping copy and data
// here lets the section components stay presentational and easy to tune.

export interface Feature {
  title: string
  description: string
  /** Stroke-based SVG path data, drawn inside a `0 0 24 24` viewBox. */
  icon: string
}

export interface Stat {
  value: string
  label: string
}

export interface ShowcaseRow {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}

export interface FooterColumn {
  heading: string
  links: { label: string; href: string }[]
}

export const FEATURES: Feature[] = [
  {
    title: "A board that moves with you",
    description:
      "Drag tasks across five stages from Backlog to Done. Changes save on their own, so the board always shows where work really stands.",
    icon: "M4 6h4v12H4zM10 6h4v12h-4zM16 6h4v12h-4z",
  },
  {
    title: "Board or list, same tasks",
    description:
      "Switch to a list when you want to scan instead of drag, then filter by assignee or status without losing your place.",
    icon: "M4 6h16M4 12h16M4 18h16",
  },
  {
    title: "Clear roles for the whole team",
    description:
      "Invite teammates by email, assign owners, and set who can change what with member, admin, and owner roles.",
    icon: "M16 18v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  },
  {
    title: "See what needs attention",
    description:
      "Priority and status badges, due dates, and overdue cues make it clear what to pick up next.",
    icon: "M12 2 3 7v6c0 5 3.8 7.7 9 9 5.2-1.3 9-4 9-9V7l-9-5Z",
  },
  {
    title: "A dark mode you will keep on",
    description:
      "A dark theme that follows your system setting and stays readable in both light and dark.",
    icon: "M12 3a9 9 0 1 0 9 9 5.4 5.4 0 0 1-9-9Z",
  },
  {
    title: "Built to be accessible",
    description:
      "Full keyboard navigation, screen reader announcements while you drag, and color contrast that meets WCAG.",
    icon: "M12 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 8l7 1 7-1M12 9v6m0 0-3 5m3-5 3 5",
  },
]

export const STATS: Stat[] = [
  { value: "5", label: "workflow stages" },
  { value: "2", label: "views of every task" },
  { value: "3", label: "roles per team" },
  { value: "1", label: "shared workspace" },
]

export const SHOWCASE_ROWS: ShowcaseRow[] = [
  {
    eyebrow: "Plan",
    title: "Plan on a board that keeps up",
    description:
      "Move tasks across Backlog, To do, In progress, In review, and Done. Each change saves on its own, so you're never waiting on a spinner.",
    bullets: [
      "Drag tasks with a mouse or the keyboard, with screen reader support",
      "Filter to one person without hiding the rest of the board",
      "Loading placeholders that prevent layout jumps",
    ],
  },
  {
    eyebrow: "Focus",
    title: "A list for heads-down days",
    description:
      "Switch to the list to work top to bottom. Stack status and assignee filters to get straight to what's yours.",
    bullets: [
      "One click between board and list",
      "Combine status and assignee filters",
      "Open any task for the full details",
    ],
  },
  {
    eyebrow: "Together",
    title: "Bring the whole team in",
    description:
      "Group work into teams and projects, invite people by email, and decide who can change what with clear roles.",
    bullets: [
      "Invite teammates by email",
      "Owner, admin, and member roles",
      "Projects scoped to each team",
    ],
  },
]

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Showcase", href: "#showcase" },
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
]
