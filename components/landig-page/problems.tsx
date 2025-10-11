"use client"

import type React from "react"

import Image from "next/image"

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
        title: "Nggak Enak Nagih",
        desc: '"Mau ngingetin teman soal utang atau iuran tapi takut merusak pertemanan. Akhirnya, pakai uang pribadi dulu."',
        image: "/orang.png",
        alt: "Wajah ragu saat memikirkan utang dan iuran",
    },
    {
        accent: "blue" as const,
        title: "Nggak Enak Nagih",
        desc: '"Harus selalu ingat jadwal iuran, menghitung total, dan mengecek transferan satu per satu. Melelahkan dan rawan lupa."',
        image: "/kalender.png",
        alt: "Ikon kalender dan pengingat",
    },
] as const

export function Problems() {
    return (
        <section
            className="mx-auto max-w-7xl px-4 py-10 md:py-16"
            style={
                {
                    ["--emerald"]: "16 185 129", // #10B981
                    ["--purple"]: "139 92 246", // #8B5CF6
                    ["--blue"]: "58 134 255", // #3A86FF
                } as React.CSSProperties
            }
        >
            <div className="mt-2 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                {problems.map((p) => {
                    const colorVar =
                        p.accent === "emerald" ? "var(--emerald)" : p.accent === "purple" ? "var(--purple)" : "var(--blue)"
                    const archBg = `bg-[linear-gradient(180deg,_rgb(${colorVar})_0%,_rgba(${colorVar},0.85)_60%,_rgba(${colorVar},0)_100%)]`

                    return (
                        <article
                            key={p.title + p.image}
                            aria-label={p.title}
                            className="relative overflow-hidden rounded-2xl border border-border bg-background"
                            style={{}}
                        >
                            <figure className={`${archBg} rounded-t-[2.25rem] px-6 pt-8 pb-4 min-h-48 flex items-end justify-center`}>
                                <Image
                                    src={p.image || "/placeholder.svg"}
                                    alt={p.alt}
                                    width={640}
                                    height={420}
                                    className="h-40 w-auto object-contain drop-shadow-[0_10px_24px_rgba(2,6,23,0.25)]"
                                    priority
                                />
                            </figure>

                            <div className="px-6 py-6">
                                <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                                <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{p.desc}</p>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
