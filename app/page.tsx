import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/marketing/hero"
import { SocialProof } from "@/components/marketing/social-proof"
import { Problems } from "@/components/marketing/problems"
import { Solution } from "@/components/marketing/solution"
import { Features } from "@/components/marketing/features"
import { TestimonialFinalCTA } from "@/components/marketing/testimonial"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <div className="mt-8" />
      <SocialProof />
      <Problems />
      <Solution />
      <Features />
      <TestimonialFinalCTA />
    </main>
  )
}
