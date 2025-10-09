"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TestimonialFinalCTA() {
    return (
        <section className="px-4 pb-20">
            <div className="mx-auto max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 shadow-2xl">
                <p className="text-center text-sm font-medium text-foreground/70">Jangan Hanya Percaya Kata Kami.</p>

                <div className="mt-6 flex flex-col items-center text-center">
                    <Image
                        src={"/placeholder.svg?height=96&width=96&query=Foto%20profil%20Sarah"}
                        alt="Foto profil Sarah"
                        width={96}
                        height={96}
                        className="rounded-full border border-white/30"
                    />
                    <blockquote className="mt-4 text-lg md:text-xl text-pretty">
                        “Sebagai bendahara acara kampus, CredBar benar-benar penyelamat. Semua iuran dari berbagai divisi tercatat
                        rapi dan transparan. Laporan keuangannya juga gampang banget diekspor buat pertanggungjawaban. Highly
                        recommended!”
                    </blockquote>
                    <cite className="mt-2 text-foreground/70">— Sarah, Bendahara Makrab 2025</cite>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-xl md:text-2xl font-[family-name:var(--font-poppins)] font-semibold">
                        Siap Mengubah Cara Anda Mengelola Keuangan Kelompok?
                    </h3>
                    <Button asChild size="lg" className="mt-4 font-semibold">
                        <Link href="/register" aria-label="Daftar sekarang gratis">
                            Daftar Sekarang - 100% Gratis
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
