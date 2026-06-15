import { CtaBand } from "./CtaBand"
import { FeatureGrid } from "./FeatureGrid"
import { Hero } from "./Hero"
import { MarketingFooter } from "./MarketingFooter"
import { MarketingHeader } from "./MarketingHeader"
import { Showcase } from "./Showcase"

export function LandingPage() {
  return (
    <div className="bg-canvas text-ink min-h-screen">
      <MarketingHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <Showcase />
        <CtaBand />
      </main>
      <MarketingFooter />
    </div>
  )
}
