"use client"

import { CheckCircle2 } from "lucide-react"

const solutions = [
    {
        text: "Dashboard Terpusat untuk Semua: Semua anggota bisa melihat status pembayaran iuran dan hutang secara real-time.",
    },
    {
        text: "Pengingat Otomatis yang Sopan: Biarkan sistem kami yang bekerja. Pengingat jatuh tempo dikirim otomatis.",
    },
    {
        text: "Laporan Keuangan Instan: Ekspor laporan grup ke PDF dengan sekali klik.",
    },
]

export function Solution() {
    return (
        <section className="px-4">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-poppins)] font-semibold text-center">
                    Semua Jadi Otomatis, Transparan, dan Tanpa Canggung.
                </h2>
                <ul className="mt-6 space-y-4">
                    {solutions.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-[rgb(var(--color-success))]" aria-hidden="true" />
                            <p className="text-foreground/90">{s.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
