import { Hero } from "@/components/landig-page/hero"
import { SocialProof } from "@/components/landig-page/social-proof"
import { Problems } from "@/components/landig-page/problems"
import { Solution } from "@/components/landig-page/solution"
import { Features } from "@/components/landig-page/features"
import { TestimonialFinalCTA } from "@/components/landig-page/testimonial"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-[#F9FAFB]">
      {/* Simple elegant background for the whole landing page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-60
                   bg-[radial-gradient(1200px_600px_at_15%_-10%,rgba(58,134,255,0.20),transparent_60%),radial-gradient(1200px_600px_at_85%_110%,rgba(167,243,208,0.18),transparent_60%),radial-gradient(1000px_520px_at_90%_0%,rgba(139,92,246,0.16),transparent_60%)]"
      />
      <Navbar />
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
