"use client"

import type React from "react"
import Image from "next/image"

// Helper to create rgba from hex for smooth alpha gradients
function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace("#", "")
    const bigint = Number.parseInt(h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const problems = [
    {
        accent: "emerald" as const,
        title: "Kurang Transparan",
        desc: '"Siapa yang sudah bayar dan siapa yang belum? Pencatatan di grup chat sering tenggelam dan bikin salah paham."',
        image: "/laptop.png",
        alt: "Spreadsheet pembayaran di layar laptop",
    },
    {
        accent: "purple" as const,
        title: "Nggak Enak Nagih 😅",
        desc: '"Mau ngingetin teman soal utang atau iuran tapi takut merusak pertemanan. Akhirnya, pakai uang pribadi dulu."',
        image: "/orang.png",
        alt: "Wajah ragu saat memikirkan utang dan iuran",
    },
    {
        accent: "blue" as const,
        title: "Ribet dan Mudah Lupa",
        desc: '"Harus selalu ingat jadwal iuran, menghitung total, dan mengecek transferan satu per satu. Melelahkan dan rawan lupa."',
        image: "/kalender.png",
        alt: "Ikon kalender dan pengingat",
    },
] as const

export function Problems() {
    return (
        <section
            className="relative mx-auto max-w-7xl px-4 py-14 md:py-20 text-center"
            style={
                {
                    ["--emerald"]: "#10B981",
                    ["--purple"]: "#8B5CF6",
                    ["--blue"]: "#3A86FF",
                } as React.CSSProperties
            }
        >
            {/* Heading: keep copy, improve balance and use the same emerald token */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 leading-tight text-balance tracking-tight">
                Pusing ngurusin duit patungan? <span style={{ color: "var(--emerald)" }}>Kami paham.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {problems.map((p) => {
                    const color =
                        p.accent === "emerald" ? "var(--emerald)" : p.accent === "purple" ? "var(--purple)" : "var(--blue)"

                    // Build a multi-stop gradient to better match the mock:
                    // solid -> rich -> soft tint -> near white
                    const base = p.accent === "emerald" ? "#10B981" : p.accent === "purple" ? "#8B5CF6" : "#3A86FF"

                    const archStyle: React.CSSProperties = {
                        background: `linear-gradient(180deg,
                          ${base} 0%,
                          ${hexToRgba(base, 0.95)} 50%,
                          ${hexToRgba(base, 0.22)} 85%,
                          ${hexToRgba("#FFFFFF", 1)} 100%)`,
                    }

                    return (
                        <article
                            key={p.title}
                            className="relative overflow-hidden rounded-[2rem] shadow-md bg-white transition-transform duration-300 hover:scale-[1.02]"
                        >
                            {/* Bagian atas melengkung dengan radial highlight untuk depth */}
                            <div
                                className="relative flex items-end justify-center rounded-t-[3rem] h-[360px] md:h-[400px] px-6 pb-8 pt-10"
                                style={archStyle}
                            >
                                {/* Highlight lembut */}
                                <div
                                    className="pointer-events-none absolute inset-x-6 top-6 h-24 rounded-[2rem] opacity-30"
                                    style={{
                                        background: `radial-gradient(120% 80% at 50% 0%,
                                          ${hexToRgba("#FFFFFF", 0.9)} 0%,
                                          ${hexToRgba("#FFFFFF", 0)} 70%)`,
                                    }}
                                />
                                <Image
                                    src={p.image || "/placeholder.svg"}
                                    alt={p.alt}
                                    width={640}
                                    height={420}
                                    className="h-44 md:h-52 w-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                                    priority
                                />
                            </div>

                            {/* Konten bawah: tipografi lebih menarik */}
                            <div className="px-6 py-8 text-center">
                                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{p.title}</h3>
                                <p className="mt-3 text-[15px] md:text-[16px] leading-relaxed text-slate-700 text-pretty">{p.desc}</p>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
