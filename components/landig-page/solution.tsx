"use client"

import type React from "react"
import { BarChart3, Bell, FileText } from "lucide-react"

type CardSpec = {
    title: string
    desc: string
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    // RGB strings for brand accents (kept consistent with existing palette)
    from: string
    to: string
}

const cards: CardSpec[] = [
    {
        title: "Dashboard Terpusat",
        desc: "Semua anggota dapat melihat ringkasan serta riwayat pembayaran iuran dan hutang secara real-time. Tak ada lagi pertanyaan 'siapa yang belum bayar?' karena semua data tercatat dengan jelas di satu tempat yang bisa diakses oleh seluruh tim.",
        Icon: BarChart3,
        from: "16 185 129", // emerald
        to: "5 150 105",
    },
    {
        title: "Pengingat Otomatis",
        desc: "Biarkan sistem kami yang bekerja. Pengingat jatuh tempo akan dikirimkan secara otomatis ke email dan profil setiap anggota sebelum dan saat tanggal pembayaran tiba. Anda tidak perlu lagi merasa canggung untuk menagih secara personal, semua berjalan sesuai jadwal.",
        Icon: Bell,
        from: "139 92 246", // purple
        to: "109 40 217",
    },
    {
        title: "Laporan Instan",
        desc: "Butuh rekapitulasi bulanan untuk pertanggungjawaban? Ekspor laporan keuangan grup yang sederhana dan rapi dalam format PDF hanya dengan sekali klik. Cocok untuk laporan kas komunitas, tim, atau sekadar arsip pribadi.",
        Icon: FileText,
        from: "58 134 255", // blue
        to: "37 99 235",
    },
]

export function Solution() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24" aria-labelledby="solution-heading">
            <h2
                id="solution-heading"
                className="text-balance text-center text-2xl md:text-4xl font-semibold tracking-tight text-foreground"
            >
                Semua Jadi Otomatis, Transparan, dan Tanpa Canggung.
            </h2>

            <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
                {cards.map(({ title, desc, Icon, from, to }, idx) => (
                    <article
                        key={idx}
                        className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(2,6,23,0.16)]"
                        aria-labelledby={`card-${idx}-title`}
                    >
                        {/* Accent gradient halo */}
                        <div
                            className="pointer-events-none absolute -inset-px opacity-70"
                            style={{
                                background: `linear-gradient(180deg, rgba(${from},0.20), rgba(${to},0.10))`,
                            }}
                            aria-hidden="true"
                        />
                        {/* Card content */}
                        <div className="relative p-6 sm:p-7">
                            <div className="flex items-center gap-4">
                                <div
                                    className="grid size-12 place-items-center rounded-2xl text-white ring-1 ring-white/40 shadow-inner"
                                    style={{
                                        background: `linear-gradient(135deg, rgb(${from}) 0%, rgb(${to}) 100%)`,
                                    }}
                                    aria-hidden="true"
                                >
                                    <Icon className="size-6" />
                                </div>
                                <h3 id={`card-${idx}-title`} className="text-xl sm:text-2xl font-extrabold text-foreground">
                                    {title}
                                </h3>
                            </div>

                            <p className="mt-4 text-pretty text-sm sm:text-base leading-relaxed text-foreground/80">{desc}</p>
                        </div>

                        {/* Subtle bottom fade for glassmorphism depth */}
                        <div
                            className="pointer-events-none h-20 w-full"
                            style={{
                                background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.32))`,
                            }}
                            aria-hidden="true"
                        />
                    </article>
                ))}
            </div>
        </section>
    )
}
