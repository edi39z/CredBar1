"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* soft radial background accents */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_0%_10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(800px_500px_at_100%_20%,rgba(16,185,129,0.16),transparent_60%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: copy in a glass panel */}
                <div className="lg:col-span-6">
                    <div className="rounded-[28px] bg-background/60 backdrop-blur-xl border border-border/50 shadow-xl p-6 md:p-8">
                        <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-poppins)] font-bold text-balance">
                            Keuangan Bareng, Jadi Gampang. Bye-Bye Ribet!
                        </h1>
                        <p className="mt-4 text-base md:text-lg text-foreground/80 text-pretty">
                            CredBar adalah cara baru yang transparan untuk mengelola iuran, patungan, dan hutang di kelompokmu.
                            Lupakan drama menagih manual—semua tercatat dan diingatkan otomatis.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <Button asChild size="lg" className="rounded-full px-6">
                                <Link href="/login">Mulai Sekarang</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="secondary"
                                className="rounded-full px-6 border border-border/50 bg-background/70 backdrop-blur-xl"
                            >
                                <Link href="/tutor">Detail</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right: visual with floating glass cards */}
                <div className="lg:col-span-6">
                    <div className="relative rounded-[28px] bg-background/60 backdrop-blur-xl border border-border/50 shadow-xl p-4 md:p-6">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                            <Image src={"/hero.png"} alt="Ilustrasi aplikasi CredBar" fill className="object-cover" priority />
                        </div>

                        {/* floating glass cards (decorative) */}
                        <div aria-hidden="true">
                            <div className="hidden md:block">
                                <div className="absolute -top-5 right-10 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-md px-4 py-2 text-sm font-semibold">
                                    Fitur 2
                                </div>
                                <div className="absolute -bottom-6 left-8 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-md px-4 py-2 text-sm font-semibold">
                                    Keunggulan
                                </div>
                                <div className="absolute top-10 -left-4 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/40 shadow-md px-4 py-2 text-sm font-semibold">
                                    Fitur 1
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="sr-only">Pratinjau visual aplikasi dengan label fitur dan keunggulan.</p>
                </div>
            </div>
        </section>
    )
}
