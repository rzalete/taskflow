import { FEATURES } from "./marketing-content"

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-brand-accent text-sm font-semibold tracking-wide uppercase">
            What's inside
          </p>
          <h2 className="text-ink mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything a small team needs to run a project
          </h2>
          <p className="text-ink-muted mt-4 text-lg/8 text-pretty">
            Sensible defaults, fast interactions, and none of the clutter that
            slows other tools down.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="group border-line bg-surface shadow-card hover:shadow-card-hover rounded-card border p-6 transition-shadow"
            >
              <span className="bg-brand-soft text-brand-accent rounded-control flex h-11 w-11 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d={feature.icon} />
                </svg>
              </span>
              <h3 className="text-ink mt-5 text-base font-semibold">
                {feature.title}
              </h3>
              <p className="text-ink-muted mt-2 text-sm/6">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
