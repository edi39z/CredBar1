/* eslint-disable react/no-unescaped-entities */
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* 🌈 Background dengan nuansa bold biru-hijau-ungu tanpa tekstur */}
            <div aria-hidden="true" className="absolute inset-0 -z-10">
                <div className="relative h-full w-full">
                    <Image src="/bg.png" alt="" fill priority sizes="100vw" className="select-none object-cover object-center" />
                </div>
            </div>

            {/* 🌟 Panel utama glass dengan efek halus (tanpa garis atas) */}
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <div className="pointer-events-none absolute -top-24 -left-24 h-[60vh] w-[60vh] rounded-full bg-[#3A86FF]/28 blur-3xl" />
                <div className="pointer-events-none absolute top-1/3 right-[15%] h-[40vh] w-[40vh] rounded-full bg-[#A7F3D0]/30 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-[70vh] w-[70vh] rounded-full bg-[#8B5CF6]/24 blur-3xl" />
            </div>

            {/* Old: relative mx-auto mt-6 w-[92%] max-w-7xl rounded-[24px] overflow-hidden shadow[...] + white overlay */}
            <div className="relative z-10 mx-auto w-[92%] max-w-7xl">
                {/* Transparent container, no overlay */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-16 md:px-12 md:py-24">
                    {/* Left: Text content */}
                    <div className="flex flex-col justify-center gap-6 text-center lg:text-left">
                        {/* 🌟 add subtle gradient accent to part of the heading for more impact */}
                        <h1 className="text-pretty font-[family-name:var(--font-poppins)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
                            <i>
                                Keuangan Bareng, Jadi{" "}
                                <span className="bg-gradient-to-r from-[#3A86FF] via-[#8B5CF6] to-[#A7F3D0] bg-clip-text text-transparent">
                                    Gampang
                                </span>
                                . Bye-Bye Ribet!
                            </i>
                        </h1>

                        <p className="mx-auto lg:mx-0 max-w-xl text-base md:text-lg leading-relaxed text-foreground/85">
                            "CredBar adalah cara baru yang transparan untuk mengelola iuran, patungan, dan hutang di kelompokmu.
                            Lupakan drama menagih manual, semua tercatat dan diingatkan otomatis."
                        </p>

                        {/* 🌟 Tombol dengan efek glass yang lebih “air” dan transparan (tanpa garis) */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <Button
                                asChild
                                size="lg"
                                variant="glass"
                                className="rounded-full px-8 py-5 border border-white/20 bg-white/15 text-foreground shadow-lg backdrop-blur-2xl backdrop-saturate-200 hover:bg-white/25 hover:shadow-2xl transition"
                            >
                                <Link href="/login" aria-label="Mulai Sekarang">
                                    Mulai Sekarang
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="glass"
                                className="rounded-full px-8 py-5 border border-white/20 bg-white/15 text-foreground shadow-lg backdrop-blur-2xl backdrop-saturate-200 hover:bg-white/25 hover:shadow-2xl transition"
                            >
                                <Link href="/tutor" aria-label="Lihat Detail">
                                    Detail
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Placeholder kanan agar seimbang */}
                    <div aria-hidden className="hidden lg:block" />
                </div>
            </div>

            {/* 📱 Hero image di pojok kanan bawah */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-20 translate-x-6 sm:translate-x-12 translate-y-8 sm:translate-y-12"
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
