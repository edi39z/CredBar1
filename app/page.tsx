import { Hero } from "@/components/landig-page/hero"
import { SocialProof } from "@/components/landig-page/social-proof"
import { Problems } from "@/components/landig-page/problems"
import { Solution } from "@/components/landig-page/solution"
import { Features } from "@/components/landig-page/features"
import { TestimonialFinalCTA } from "@/components/landig-page/testimonial"

export default function HomePage() {
  return (
    <main>
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
