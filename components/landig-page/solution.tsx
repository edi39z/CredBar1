"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"

export function Solution() {
    const [visible, setVisible] = useState(false)
    const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = panelRef.current
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setVisible(true)
                })
            },
            { threshold: 0.2 },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <section
            className="relative isolate w-full overflow-hidden px-0 py-20 md:py-28"
            aria-labelledby="solution-heading"
        >
            {/* Background gradient & pattern */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(58,134,255,0.14) 0%, rgba(139,92,246,0.14) 40%, rgba(16,185,129,0.14) 100%)," +
                        "radial-gradient(1200px 600px at 15% 10%, rgba(58,134,255,0.28), transparent 60%)," +
                        "radial-gradient(1000px 520px at 85% 20%, rgba(139,92,246,0.28), transparent 60%)," +
                        "radial-gradient(1200px 600px at 50% 110%, rgba(16,185,129,0.25), transparent 65%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-25 mix-blend-overlay"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 2px, rgba(255,255,255,0) 2px 8px)," +
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0 1px, transparent 2px)",
                    backgroundSize: "auto, 6px 6px",
                }}
            />

            <div className="mx-auto max-w-7xl px-4">
                <h2
                    id="solution-heading"
                    className="text-balance text-center text-2xl md:text-4xl font-semibold tracking-tight text-foreground"
                >
                    Semua Jadi Otomatis, Transparan, dan Tanpa Canggung.
                </h2>

                <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
                    {/* Phone mockup */}
                    <div
                        className={`relative mx-auto w-full max-w-md transition-transform duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                            }`}
                        style={{ transitionDelay: "80ms" }}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -z-10 left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-80"
                            style={{
                                background:
                                    "radial-gradient(60% 60% at 50% 50%, rgba(58,134,255,0.35), rgba(139,92,246,0.28), rgba(16,185,129,0.24), transparent 70%)",
                            }}
                        />
                        <img
                            src="/hp.png"
                            alt="Tampilan aplikasi CredBar di ponsel"
                            className="block w-full h-auto select-none pointer-events-none [filter:drop-shadow(0_24px_60px_rgba(2,6,23,0.45))]"
                        />
                    </div>

                    {/* ======= CARD PANEL (Upgraded) ======= */}
                    <div
                        ref={panelRef}
                        className={`relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/50 
            px-8 py-10 shadow-[0_25px_80px_rgba(2,6,23,0.15)] backdrop-blur-3xl 
            md:px-12 md:py-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                            }`}
                    >
                        {/* Mini Icons Header */}
                        <div className="mb-7 flex items-center gap-4 text-primary">
                            <ShieldCheck className="h-6 w-6 text-emerald-500 drop-shadow-sm animate-pulse" />
                            <Sparkles className="h-6 w-6 text-violet-500 drop-shadow-sm animate-spin-slow" />
                        </div>

                        {/* Card Content */}
                        <ul className="space-y-8 md:space-y-10">
                            {[
                                {
                                    title: "Satu Dashboard, Semua Terpantau",
                                    desc: "Semua anggota langsung tahu siapa yang sudah bayar, siapa yang belum. Real-time, rapi, tanpa ribet.",
                                    color: "from-emerald-400 to-green-500",
                                    icon: CheckCircle2,
                                },
                                {
                                    title: "Tagih Sekali, Ingat Selamanya",
                                    desc: "Jadwal otomatis untuk iuran rutin. Notifikasi dan invoice terkirim tepat waktu tanpa perlu chat manual.",
                                    color: "from-violet-400 to-indigo-500",
                                    icon: Sparkles,
                                },
                                {
                                    title: "Transparan, Tanpa Drama",
                                    desc: "Unggah bukti transfer, konfirmasi 1-klik, dan semua terekam rapi. Jujur dan aman untuk semua.",
                                    color: "from-emerald-400 to-violet-500",
                                    icon: ShieldCheck,
                                },
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className={`flex items-start gap-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                        }`}
                                    style={{ transitionDelay: `${i * 120 + 140}ms` }}
                                >
                                    <span
                                        className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ring-2 ring-white/40 transition-transform hover:scale-110`}
                                        aria-hidden="true"
                                    >
                                        <item.icon className="h-6 w-6 text-white" />
                                    </span>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground/80">
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Bottom Fade */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none mt-10 h-20 w-full rounded-b-3xl"
                            style={{
                                background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.45))",
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
