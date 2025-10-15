"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TestimonialFinalCTA() {
    return (
        <section className="px-4 pb-20">
            <div
                className="
          mx-auto max-w-5xl rounded-2xl md:rounded-3xl
          bg-[rgb(var(--color-primary))] text-white
          shadow-[0_28px_80px_-20px_rgba(30,58,138,0.45)]
          px-6 py-10 md:px-12 md:py-14
        "
            >
                <h3
                    className="
            text-center font-semibold
            text-[rgb(var(--color-warning))] 
            text-2xl md:text-3xl
          "
                >
                    Siap Mengelola Keuangan Kelompok Tanpa Stres?
                </h3>

                <p className="mt-3 text-center text-base md:text-lg text-white/90 text-pretty">
                    Buat akun gratis dalam 1 menit dan bergabunglah dengan ratusan tim, komunitas, dan kelompok kos yang telah
                    merasakan transparansi keuangan.
                </p>

                <div className="mt-8 flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="
              proximity-glow rounded-full
              bg-[rgb(var(--color-warning))] text-[rgb(var(--color-warning-foreground))]
              hover:bg-[rgb(var(--color-warning))/0.9]
              px-7 md:px-8 h-12 md:h-14 text-base md:text-lg font-semibold
              shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)]
            "
                    >
                        <Link href="/login" aria-label="Mulai sekarang - masuk atau daftar">
                            Mulai Sekarang
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
