"use client"

import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Repeat, ClipboardList, BarChart3, Lock, Bell, Zap, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        id: 1,
        icon: Users,
        title: "Manajemen Grup Mudah",
        description:
            "Buat grup dalam hitungan detik dan undang anggota melalui link atau email. Kelola anggota dengan role admin dan member.",
        color: "from-teal-400 to-teal-600",
    },
    {
        id: 2,
        icon: Repeat,
        title: "Iuran Berulang Otomatis",
        description:
            "Atur iuran harian, mingguan, bulanan, atau tahunan. Sistem otomatis mengirim invoice ke semua anggota tepat waktu.",
        color: "from-purple-400 to-purple-600",
    },
    {
        id: 3,
        icon: ClipboardList,
        title: "Transparansi Pembayaran",
        description:
            "Lacak status pembayaran real-time untuk setiap anggota. Upload bukti pembayaran dan konfirmasi dengan satu klik.",
        color: "from-blue-400 to-blue-600",
    },
    {
        id: 4,
        icon: BarChart3,
        title: "Laporan & Analitik",
        description:
            "Dashboard visual menampilkan arus kas, status pembayaran, dan laporan keuangan. Ekspor ke PDF dengan mudah.",
        color: "from-orange-400 to-orange-600",
    },
    {
        id: 5,
        icon: Lock,
        title: "Keamanan Data",
        description: "Enkripsi end-to-end untuk semua transaksi. Data Anda aman dan hanya bisa diakses oleh anggota grup.",
        color: "from-red-400 to-red-600",
    },
    {
        id: 6,
        icon: Bell,
        title: "Notifikasi Cerdas",
        description:
            "Pengingat otomatis untuk pembayaran yang akan jatuh tempo. Notifikasi real-time untuk setiap aktivitas penting.",
        color: "from-pink-400 to-pink-600",
    },
    {
        id: 7,
        icon: Zap,
        title: "Integrasi Pembayaran",
        description:
            "Terima pembayaran melalui transfer bank, e-wallet, atau metode lainnya. Semua terintegrasi dalam satu platform.",
        color: "from-yellow-400 to-yellow-600",
    },
    {
        id: 8,
        icon: TrendingUp,
        title: "Riwayat Lengkap",
        description:
            "Akses riwayat transaksi lengkap dengan detail pembayaran, tanggal, dan catatan untuk audit trail yang sempurna.",
        color: "from-green-400 to-green-600",
    },
]

export default function FiturPage() {
    return (
        <main className="relative overflow-x-clip bg-[#F9FAFB]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-60
                   bg-[radial-gradient(1200px_600px_at_15%_-10%,rgba(58,134,255,0.20),transparent_60%),radial-gradient(1200px_600px_at_85%_110%,rgba(167,243,208,0.18),transparent_60%),radial-gradient(1000px_520px_at_90%_0%,rgba(139,92,246,0.16),transparent_60%)]"
            />
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] w-full overflow-hidden pt-[120px] pb-20">
                <div className="mx-auto w-[92%] max-w-7xl px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-pretty font-[family-name:var(--font-poppins)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
                            Fitur-Fitur Unggulan{" "}
                            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3A86FF] to-[#10B981] bg-clip-text text-transparent">
                                CredBar
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-foreground/85">
                            Semua yang Anda butuhkan untuk mengelola keuangan bersama dengan mudah, transparan, dan aman.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-all hover:shadow-[0_10px_50px_rgba(0,0,0,0.1)] hover:border-white/50"
                            >
                                {/* Background gradient */}
                                <div
                                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${feature.color}`}
                                />

                                {/* Icon */}
                                <div
                                    className={`relative mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3 text-white`}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative mx-auto max-w-7xl px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 p-12 text-center backdrop-blur-2xl"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Siap Mencoba Semua Fitur?</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan pengguna yang telah mempermudah pengelolaan keuangan bersama mereka.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full px-9 py-6 text-base font-semibold bg-[#2A8757] hover:bg-[#256c47] text-white shadow-lg hover:shadow-xl transition-all"
                    >
                        <Link href="/login">Mulai Sekarang</Link>
                    </Button>
                </motion.div>
            </section>

            <SiteFooter />
        </main>
    )
}
