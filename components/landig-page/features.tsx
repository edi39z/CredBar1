"use client"
import { Users, Repeat, CheckCircle2Icon, LinkIcon, Mail, Upload, ClipboardList } from "lucide-react"

type Step = {
    id: number
    badge: string
    title: string
    align: "left" | "right"
    text: string
    visual: {
        alt: string
        // NOTE: swap with real screenshots/GIFs later
        src: string
    }
}

const steps: Step[] = [
    {
        id: 1,
        badge: "LANGKAH 1",
        title: "1. Mulai Kolaborasi dalam Hitungan Detik",
        align: "left",
        text: 'Lupakan pengaturan yang rumit. Di CredBar, Anda bisa membuat "room" atau grup keuangan hanya dalam satu menit. Cukup beri nama grup Anda (misalnya: "Uang Kas Kosan" atau "Tim Futsal Ceria"), lalu undang anggota melalui link unik atau email. Anda juga bisa langsung menetapkan siapa yang menjadi Admin untuk mengelola tagihan dan siapa yang menjadi Anggota biasa.',
        visual: {
            alt: "Form Buat Room Baru dan undang anggota via link atau email",
            src: "/kos.png",
        },
    },
    {
        id: 2,
        badge: "LANGKAH 2",
        title: "2. Atur Sekali, Otomatis Selamanya",
        align: "right",
        text: "Untuk tagihan rutin seperti WiFi, uang kas, atau langganan bersama, atur sebagai iuran berkala (harian, mingguan, bulanan, atau tahunan). Setelah disimpan, CredBar otomatis membuat dan mengirimkan invoice pada semua anggota sesuai jadwal—benar‑benar ‘atur dan lupakan’.",
        visual: {
            alt: "Form Iuran Bulanan memilih frekuensi Setiap Bulan",
            src: "/wifi2.png",
        },
    },
    {
        id: 3,
        badge: "LANGKAH 3",
        title: "3. Transparansi Penuh, Tanpa Perlu Bertanya",
        align: "left",
        text: "Semua anggota melihat status pembayaran secara real-time: Lunas, Menunggu Konfirmasi, atau Belum Bayar. Anggota dapat mengunggah bukti transfer, dan admin cukup satu klik untuk konfirmasi—semua tercatat jelas dan menghilangkan kecanggungan.",
        visual: {
            alt: "Dashboard grup menampilkan daftar anggota dengan status Lunas, Menunggu Konfirmasi, Belum Bayar",
            src: "/iuran.png",
        },
    },
]

function BrowserMock({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
            <div className="flex items-center gap-1 border-b border-black/5 bg-gray-50/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <div className="ml-3 h-5 flex-1 rounded bg-gray-100" />
            </div>
            <div className="relative">
                {/* Use plain img to avoid layout shift in Next.js */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src || "/placeholder.svg"} alt={alt} className="h-auto w-full" />
            </div>
        </div>
    )
}

export function Features() {
    return (
        <section id="features" className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
            {/* Heading */}
            <div className="mb-16 text-center">
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Begini Cara Kerjanya</h2>
                <p className="mt-4 text-pretty text-base text-foreground/70 sm:text-lg">
                    Bukti visual konkret tentang bagaimana fitur-fitur CredBar benar-benar bekerja—mengurangi keraguan tentang
                    kemudahan penggunaan.
                </p>
            </div>

            <div className="relative">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/10 via-blue-500/30 to-blue-500/10 lg:block"
                />

                <div className="space-y-16 lg:space-y-28">
                    {steps.map((s) => (
                        <div
                            key={s.id}
                            className={`grid grid-cols-1 items-start gap-8 lg:grid-cols-12 ${s.align === "left" ? "" : ""}`}
                        >
                            {/* Number dot on the center line */}
                            <div
                                className={`relative order-2 hidden items-center justify-center lg:order-none lg:col-span-12 lg:flex`}
                            >
                                <div className="absolute left-1/2 z-10 h-8 w-8 -translate-x-1/2 rounded-full bg-blue-600 text-center text-sm font-bold text-white shadow-lg">
                                    <div className="flex h-full items-center justify-center">{s.id}</div>
                                </div>
                            </div>

                            {/* Text column */}
                            <div
                                className={`${s.align === "left" ? "lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8"}`}
                            >
                                <div className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-xl lg:p-8">
                                    <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                        {s.badge}
                                    </div>

                                    <div className="mb-4 flex items-center gap-2">
                                        {s.id === 1 && <Users className="h-5 w-5 text-blue-600" />}
                                        {s.id === 2 && <Repeat className="h-5 w-5 text-blue-600" />}
                                        {s.id === 3 && <ClipboardList className="h-5 w-5 text-blue-600" />}
                                        <h3 className="text-xl font-bold text-gray-900 lg:text-2xl">{s.title}</h3>
                                    </div>

                                    <p className="text-sm leading-relaxed text-gray-700">{s.text}</p>

                                    {/* Helpful micro-cues per step */}
                                    {s.id === 1 && (
                                        <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                                <LinkIcon className="h-4 w-4 text-blue-600" /> Bagikan link undangan
                                            </li>
                                            <li className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                                <Mail className="h-4 w-4 text-blue-600" /> Kirim via email
                                            </li>
                                        </ul>
                                    )}
                                    {s.id === 2 && (
                                        <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                                <Repeat className="h-4 w-4 text-blue-600" /> Frekuensi: Setiap Bulan
                                            </li>
                                            <li className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                                <CheckCircle2Icon className="h-4 w-4 text-blue-600" /> Invoice otomatis
                                            </li>
                                        </ul>
                                    )}
                                    {s.id === 3 && (
                                        <ul className="mt-5 grid grid-cols-1 gap-2 text-xs text-gray-700">
                                            <li className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                                <Upload className="h-4 w-4 text-blue-600" /> Upload bukti transfer, konfirmasi 1‑klik
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Visual column */}
                            <div
                                className={`${s.align === "left" ? "lg:col-span-5 lg:col-start-7" : "lg:col-span-5 lg:col-start-1"}`}
                            >
                                <BrowserMock src={s.visual.src} alt={s.visual.alt} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
