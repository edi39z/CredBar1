"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            {/* Background: soft finance glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10
                    bg-[radial-gradient(1200px_600px_at_left_top,rgba(37,99,235,0.08),transparent_60%),radial-gradient(800px_400px_at_right_bottom,rgba(16,185,129,0.10),transparent_55%)]"
            />

            {/* Glass panel utama — top rounded only */}
            <div className="relative mx-auto mt-6 w-[92%] max-w-7xl rounded-t-[124px] rounded-b-none bg-white/25 backdrop-blur-xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Konten utama */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-16 md:px-12 md:py-24">
                    {/* Left: Text content */}
                    <div className="flex flex-col justify-center gap-6 text-center lg:text-left">
                        <h1 className="text-pretty font-[family-name:var(--font-poppins)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
                            <i>Keuangan Bareng, Jadi Gampang. Bye-Bye Ribet!</i>
                        </h1>

                        <p className="mx-auto lg:mx-0 max-w-xl text-base md:text-lg leading-relaxed text-foreground/80">
                            "CredBar adalah cara baru yang transparan untuk mengelola iuran, patungan, dan hutang di kelompokmu.
                            Lupakan drama menagih manual, semua tercatat dan diingatkan otomatis."
                        </p>

                        {/* Buttons — glass look */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <Button
                                asChild
                                size="lg"
                                variant="glass"
                                className="rounded-full px-8 py-5 border border-white/30 bg-white/20 text-foreground shadow-lg backdrop-blur-md hover:bg-emerald-400/30 hover:shadow-2xl transition"
                            >
                                <Link href="/login" aria-label="Mulai Sekarang">
                                    Mulai Sekarang
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="glass"
                                className="rounded-full px-8 py-5 border border-white/30 bg-white/20 text-foreground shadow-lg backdrop-blur-md hover:bg-blue-400/30 hover:shadow-2xl transition"
                            >
                                <Link href="/tutor" aria-label="Lihat Detail">
                                    Detail
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Placeholder kanan untuk layout seimbang */}
                    <div aria-hidden className="hidden lg:block" />
                </div>

                {/* Efek gradasi lembut di bawah panel */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-white/30 to-white/70 pointer-events-none" />
            </div>

            {/* Hero image di pojok kanan bawah */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-10 translate-x-6 sm:translate-x-12 translate-y-8 sm:translate-y-12"
            >
                <Image
                    src="/hero.png"
                    alt="Tampilan aplikasi CredBar pada ponsel"
                    width={720}
                    height={720}
                    priority
                    className="select-none object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.35)]"
                />
            </div>
        </section>
    )
}
