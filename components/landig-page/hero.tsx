"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center bg-[#fafafa] overflow-hidden">
            {/* Background gradient lembut */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.1),transparent_60%)]"
            />

            {/* Grid 2 kolom: teks & gambar */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl px-6 md:px-12 gap-12">
                {/* Kiri: konten utama */}
                <div className="flex-1 flex flex-col justify-center space-y-8 text-center lg:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-snug text-gray-900 font-[family-name:var(--font-poppins)]">
                        <i>Keuangan Bareng, Jadi Gampang. Bye-Bye Ribet!</i>
                    </h1>

                    <p className="text-lg text-gray-700/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        "CredBar adalah cara baru yang transparan untuk mengelola iuran, patungan, dan hutang di kelompokmu.
                        Lupakan drama menagih manual, semua tercatat dan diingatkan otomatis."
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                        {/* Tombol utama */}
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 py-5 bg-white/25 backdrop-blur-xl border border-green-400/40 text-green-700 font-semibold shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] hover:bg-green-500/40 hover:text-white transition-all duration-300"
                        >
                            <Link href="/login">Mulai Sekarang</Link>
                        </Button>

                        {/* Tombol kedua */}
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 py-5 bg-white/25 backdrop-blur-xl border border-blue-400/40 text-blue-700 font-semibold shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] hover:bg-blue-400/40 hover:text-white transition-all duration-300"
                        >
                            <Link href="/tutor">Detail</Link>
                        </Button>
                    </div>
                </div>

                {/* Kanan: gambar hero */}
                <div className="flex-1 flex justify-center items-center relative">
                    <Image
                        src="/hero.png"
                        alt="Ilustrasi aplikasi CredBar"
                        width={600} // besar proporsional
                        height={600}
                        className="object-contain select-none drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>
        </section>
    )
}
