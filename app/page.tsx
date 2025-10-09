import { Hero } from "@/components/landig-page/hero"
import { SocialProof } from "@/components/landig-page/social-proof"
import { Problems } from "@/components/landig-page/problems"
import { Solution } from "@/components/landig-page/solution"
import { Features } from "@/components/landig-page/features"
import { TestimonialFinalCTA } from "@/components/landig-page/testimonial"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip">
      {/* Simple elegant background for the whole landing page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(900px_450px_at_10%_0%,rgba(37,99,235,0.06),transparent_55%),radial-gradient(900px_450px_at_90%_100%,rgba(16,185,129,0.07),transparent_55%),repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_1px,transparent_1px,transparent_14px)]"
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
