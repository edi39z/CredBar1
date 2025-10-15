"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRightCircle } from "lucide-react"

export function TestimonialFinalCTA() {
    return (
        <section className="relative px-4 pb-24 pt-8 md:pt-12">
            {/* ====== Decorative Gradient Background ====== */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_50%_150%,rgba(16,185,129,0.25),transparent_70%)]"
            />

            {/* ====== CTA CARD ====== */}
            <div
                className="
          mx-auto max-w-5xl rounded-[2rem] md:rounded-[2.5rem]
          bg-gradient-to-r from-emerald-400 via-teal-400 to-violet-500
          shadow-[0_20px_70px_-10px_rgba(16,185,129,0.45)]
          px-8 py-12 md:px-14 md:py-16 relative overflow-hidden
          transition-all duration-500
        "
            >
                {/* Decorative sparkles */}
                <div className="absolute -top-3 left-8 flex gap-3 text-white/70">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    <Sparkles className="h-5 w-5 text-white/60 animate-pulse delay-200" />
                </div>

                {/* Inner glow overlay */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"
                />

                {/* ====== Text Content ====== */}
                <div className="relative text-center text-white">
                    <h3 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                        Siap Mengelola Keuangan Kelompok Tanpa Stres?
                    </h3>

                    <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-white/90 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                        Buat akun gratis dalam 1 menit dan bergabunglah dengan komunitas yang sudah menikmati
                        transparansi keuangan kelompok — tanpa ribet, tanpa drama.
                    </p>
                </div>

                {/* ====== CTA BUTTON ====== */}
                <div className="mt-10 flex justify-center relative z-10">
                    <Button
                        asChild
                        size="lg"
                        className="
              rounded-full
              bg-white text-violet-600 font-semibold
              hover:bg-white/90 hover:scale-105 active:scale-95
              shadow-[0_12px_35px_-10px_rgba(255,255,255,0.4)]
              transition-all duration-300
              px-8 md:px-10 h-14 text-base md:text-lg
            "
                    >
                        <Link href="/login" aria-label="Mulai sekarang - masuk atau daftar" className="flex items-center gap-2">
                            Mulai Sekarang
                            <ArrowRightCircle className="h-5 w-5 text-violet-500" />
                        </Link>
                    </Button>
                </div>

                {/* Bottom light reflection */}
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 to-transparent rounded-b-[2rem]"
                />
            </div>
        </section>
    )
}
