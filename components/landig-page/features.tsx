"use client"

import { Users, Repeat, ClipboardList, BarChart3, CheckCircle2Icon, LinkIcon, Mail, Upload, FileDown } from "lucide-react"
import { motion } from "framer-motion"

type Step = {
    id: number
    badge: string
    title: string
    align: "left" | "right"
    text: string
    visual: {
        alt: string
        src: string
    }
}

const steps: Step[] = [
    {
        id: 1,
        badge: "LANGKAH 1",
        title: "1. Buat Grup & Undang Tim",
        align: "left",
        text: `Mulai kolaborasi dalam hitungan detik. Di CredBar, Anda bisa membuat grup keuangan hanya dalam satu menit. 
    Cukup beri nama grup Anda (contoh: "Uang Kas Kosan" atau "Tim Futsal Ceria"), lalu undang anggota lewat link atau email.`,
        visual: {
            alt: "Tampilan buat grup dan undang anggota",
            src: "/kos.png",
        },
    },
    {
        id: 2,
        badge: "LANGKAH 2",
        title: "2. Atur Iuran Berulang",
        align: "right",
        text: `Untuk tagihan rutin seperti WiFi, kas bulanan, atau langganan bersama, cukup atur frekuensinya 
    (harian, mingguan, bulanan, atau tahunan). CredBar akan otomatis mengirimkan invoice ke semua anggota.`,
        visual: {
            alt: "Form pengaturan iuran berulang",
            src: "/wifi2.png",
        },
    },
    {
        id: 3,
        badge: "LANGKAH 3",
        title: "3. Lacak Pembayaran Transparan",
        align: "left",
        text: `Setiap anggota dapat melihat status pembayaran secara real-time — Lunas, Menunggu Konfirmasi, atau Belum Bayar. 
    Admin cukup satu klik untuk menyetujui bukti pembayaran yang diunggah.`,
        visual: {
            alt: "Dashboard transparansi pembayaran",
            src: "/iuran.png",
        },
    },
    {
        id: 4,
        badge: "LANGKAH 4",
        title: "4. Pantau Visual & Ekspor Laporan",
        align: "right",
        text: `Nikmati dashboard analitik yang memvisualisasikan arus kas, status pembayaran, dan laporan keuangan Anda. 
    Dengan satu klik, ekspor laporan profesional dalam format PDF untuk disimpan atau dibagikan.`,
        visual: {
            alt: "Dashboard laporan keuangan dengan grafik dan tombol ekspor",
            src: "/laporan.png",
        },
    },
]

const brandById: Record<number, { base: string; dark: string }> = {
    1: { base: "20 184 166", dark: "13 148 136" }, // teal
    2: { base: "139 92 246", dark: "109 40 217" }, // purple
    3: { base: "56 189 248", dark: "37 99 235" }, // blue
    4: { base: "249 115 22", dark: "234 88 12" },  // orange
}

function BrowserMock({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/20 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            {/* Decorative background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            {/* Frame header */}
            <div className="flex items-center gap-1 border-b border-white/30 bg-white/10 px-3 py-2 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-red-300/70" />
                <div className="ml-3 h-5 flex-1 rounded bg-white/20" />
            </div>
            <div className="relative p-2">
                <img src={src || "/placeholder.svg"} alt={alt} className="h-auto w-full rounded-2xl object-cover" />
            </div>
        </div>
    )
}

export function Features() {
    return (
        <section
            id="features"
            className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32 overflow-hidden"
        >
            {/* Section Heading */}
            <div className="mb-20 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Begini Cara Kerjanya
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Lihat bagaimana CredBar mempermudah pengelolaan iuran bersama melalui empat langkah sederhana.
                </p>
            </div>

            {/* Abstract colorful background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-80"
                style={{
                    background:
                        "radial-gradient(circle at 10% 10%, rgba(56,189,248,0.15), transparent 60%)," +
                        "radial-gradient(circle at 90% 40%, rgba(20,184,166,0.15), transparent 60%)," +
                        "radial-gradient(circle at 50% 90%, rgba(139,92,246,0.15), transparent 60%)",
                }}
            />

            {/* Timeline line (vertical for lg) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/11 hidden h-full w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-400 via-purple-400 to-teal-400 lg:block"
            />

            <div className="space-y-20 lg:space-y-32">
                {steps.map((s) => {
                    const dir = s.align === "left" ? -50 : 50
                    const brand = brandById[s.id]
                    return (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: dir }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
                        >
                            {/* Timeline number */}
                            <div className="relative order-2 hidden items-center justify-center lg:order-none lg:col-span-12 lg:flex">
                                <div
                                    className="absolute left-1/2 z-10 h-12 w-12 -translate-x-1/2 rounded-full text-center text-sm font-bold text-white shadow-xl ring-2 ring-white/40"
                                    style={{
                                        background: `linear-gradient(135deg, rgb(${brand.base}), rgb(${brand.dark}))`,
                                    }}
                                >
                                    <div className="flex h-full items-center justify-center">{s.id}</div>
                                </div>
                            </div>

                            {/* Text column */}
                            <div
                                className={`${s.align === "left" ? "lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8"
                                    }`}
                            >
                                <div
                                    className="relative rounded-3xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-all hover:shadow-[0_10px_50px_rgba(0,0,0,0.1)]"
                                >
                                    {/* Badge */}
                                    <div
                                        className="absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-white/30"
                                        style={{
                                            background: `linear-gradient(135deg, rgb(${brand.base}) 0%, rgb(${brand.dark}) 100%)`,
                                        }}
                                    >
                                        {s.badge}
                                    </div>

                                    {/* Title + Icon */}
                                    <div className="mb-4 flex items-center gap-3">
                                        {s.id === 1 && <Users className="h-5 w-5" style={{ color: `rgb(${brand.base})` }} />}
                                        {s.id === 2 && <Repeat className="h-5 w-5" style={{ color: `rgb(${brand.base})` }} />}
                                        {s.id === 3 && <ClipboardList className="h-5 w-5" style={{ color: `rgb(${brand.base})` }} />}
                                        {s.id === 4 && <BarChart3 className="h-5 w-5" style={{ color: `rgb(${brand.base})` }} />}
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900 lg:text-2xl">{s.title}</h3>
                                    </div>

                                    <p className="text-sm leading-relaxed text-gray-700">{s.text}</p>

                                    {/* Micro cues */}
                                    {s.id === 1 && (
                                        <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <LinkIcon className="h-4 w-4 text-teal-500" /> Bagikan link undangan
                                            </li>
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <Mail className="h-4 w-4 text-blue-500" /> Kirim via email
                                            </li>
                                        </ul>
                                    )}
                                    {s.id === 2 && (
                                        <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <Repeat className="h-4 w-4 text-purple-500" /> Frekuensi: Bulanan
                                            </li>
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <CheckCircle2Icon className="h-4 w-4 text-purple-500" /> Invoice otomatis
                                            </li>
                                        </ul>
                                    )}
                                    {s.id === 3 && (
                                        <ul className="mt-5 grid grid-cols-1 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <Upload className="h-4 w-4 text-blue-500" /> Upload bukti & konfirmasi 1-klik
                                            </li>
                                        </ul>
                                    )}
                                    {s.id === 4 && (
                                        <ul className="mt-5 grid grid-cols-1 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 backdrop-blur-sm">
                                                <FileDown className="h-4 w-4 text-orange-500" /> Ekspor laporan ke PDF
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Visual column */}
                            <div
                                className={`${s.align === "left" ? "lg:col-span-5 lg:col-start-7" : "lg:col-span-5 lg:col-start-1"
                                    }`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="will-change-transform"
                                >
                                    <BrowserMock src={s.visual.src} alt={s.visual.alt} />
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
