import { SHOWCASE_ROWS } from "./marketing-content"

export function Showcase() {
  return (
    <section
      id="showcase"
      className="bg-surface border-line scroll-mt-20 border-y py-20 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
        {SHOWCASE_ROWS.map((row, index) => (
          <div
            key={row.title}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="text-brand-accent text-sm font-semibold tracking-wide uppercase">
                {row.eyebrow}
              </p>
              <h3 className="text-ink mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {row.title}
              </h3>
              <p className="text-ink-muted mt-4 text-base/7 text-pretty">
                {row.description}
              </p>
              <ul className="mt-6 space-y-3">
                {row.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-ink flex items-start gap-3 text-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-accent mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
              <div className="border-line bg-canvas shadow-card rounded-card aspect-[4/3] overflow-hidden border p-5">
                <div className="bg-brand-soft/50 rounded-control flex h-full w-full items-center justify-center">
                  <span className="text-brand-accent text-5xl font-bold opacity-40">
                    {row.eyebrow}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
