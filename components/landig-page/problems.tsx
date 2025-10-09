"use client"

import { AlertTriangle, EyeOff, CalendarClock } from "lucide-react"

const problems = [
    {
        icon: EyeOff,
        title: "Kurang Transparan",
        desc: "Siapa yang sudah bayar dan siapa yang belum? Pencatatan di grup chat sering tenggelam dan bikin salah paham.",
    },
    {
        icon: AlertTriangle,
        title: "Nggak Enak Nagih",
        desc: "Mau ngingetin teman soal utang atau iuran tapi takut merusak pertemanan. Akhirnya, pakai uang pribadi dulu.",
    },
    {
        icon: CalendarClock,
        title: "Serba Manual & Lupa",
        desc: "Harus selalu ingat jadwal iuran, menghitung total, dan mengecek transferan satu per satu. Melelahkan dan rawan lupa.",
    },
]

export function Problems() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-poppins)] font-semibold text-center">
                Pusing ngurusin duit patungan? Kami paham.
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {problems.map((p) => (
                    <div key={p.title} className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-lg">
                        <p.icon className="h-6 w-6 text-foreground/80" aria-hidden="true" />
                        <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                        <p className="mt-2 text-foreground/80 text-sm">{p.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
