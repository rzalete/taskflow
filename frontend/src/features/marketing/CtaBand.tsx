import { Link } from "react-router"

export function CtaBand() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="bg-brand-gradient shadow-brand rounded-card relative mx-auto max-w-5xl overflow-hidden px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="rounded-pill pointer-events-none absolute -top-24 right-0 h-64 w-64 bg-white/10 blur-3xl"
        />
        <h2 className="relative text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          Give your team one place to work
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-base/7 text-pretty text-white/80">
          Create your workspace, invite the team, and start your first board
          today. No credit card required.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-control bg-surface text-brand-accent hover:bg-well w-full px-6 py-3 text-base font-semibold transition-colors sm:w-auto"
          >
            Start for free
          </Link>
          <a
            href="#features"
            className="rounded-control w-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            See the features
          </a>
        </div>
      </div>
    </section>
  )
}
