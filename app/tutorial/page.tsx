"use client"

import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play, BookOpen, HelpCircle, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const tutorials = [
    {
        id: 1,
        title: "Cara Membuat Grup Pertama",
        description: "Pelajari langkah demi langkah cara membuat grup baru dan mengundang anggota.",
        duration: "5 menit",
        level: "Pemula",
        icon: Users,
        color: "from-teal-400 to-teal-600",
    },
    {
        id: 2,
        title: "Mengatur Iuran Berulang",
        description: "Pahami cara mengatur iuran otomatis dengan berbagai frekuensi pembayaran.",
        duration: "7 menit",
        level: "Pemula",
        icon: Zap,
        color: "from-purple-400 to-purple-600",
    },
    {
        id: 3,
        title: "Mengelola Pembayaran",
        description: "Panduan lengkap untuk upload bukti pembayaran dan konfirmasi pembayaran.",
        duration: "6 menit",
        level: "Menengah",
        icon: BookOpen,
        color: "from-blue-400 to-blue-600",
    },
    {
        id: 4,
        title: "Membaca Laporan Keuangan",
        description: "Belajar menginterpretasi dashboard dan laporan keuangan untuk analisis mendalam.",
        duration: "8 menit",
        level: "Menengah",
        icon: BookOpen,
        color: "from-orange-400 to-orange-600",
    },
    {
        id: 5,
        title: "Tips Manajemen Grup",
        description: "Strategi terbaik untuk mengelola grup besar dan menghindari konflik pembayaran.",
        duration: "10 menit",
        level: "Lanjutan",
        icon: HelpCircle,
        color: "from-pink-400 to-pink-600",
    },
    {
        id: 6,
        title: "Troubleshooting Umum",
        description: "Solusi untuk masalah yang sering dihadapi pengguna CredBar.",
        duration: "9 menit",
        level: "Lanjutan",
        icon: HelpCircle,
        color: "from-red-400 to-red-600",
    },
]

const faqs = [
    {
        question: "Apakah CredBar gratis?",
        answer:
            "Ya, CredBar sepenuhnya gratis untuk digunakan. Kami tidak mengenakan biaya untuk membuat grup, mengatur iuran, atau mengelola pembayaran.",
    },
    {
        question: "Berapa banyak anggota yang bisa saya tambahkan?",
        answer: "Tidak ada batasan jumlah anggota. Anda bisa menambahkan sebanyak mungkin anggota ke dalam grup Anda.",
    },
    {
        question: "Apakah data saya aman?",
        answer:
            "Semua data Anda dienkripsi dan disimpan dengan aman. Hanya anggota grup yang bisa mengakses informasi grup Anda.",
    },
    {
        question: "Bagaimana jika saya lupa password?",
        answer:
            "Anda bisa mereset password melalui halaman login dengan mengklik 'Lupa Password' dan mengikuti instruksi yang dikirim ke email Anda.",
    },
    {
        question: "Bisakah saya menghapus grup?",
        answer:
            "Ya, admin grup bisa menghapus grup kapan saja. Namun, pastikan semua pembayaran sudah selesai sebelum menghapus grup.",
    },
    {
        question: "Bagaimana cara mengekspor laporan?",
        answer: "Di halaman laporan, klik tombol 'Ekspor PDF' untuk mengunduh laporan keuangan dalam format PDF.",
    },
]

export default function TutorialPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
                            Pusat Pembelajaran{" "}
                            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3A86FF] to-[#10B981] bg-clip-text text-transparent">
                                CredBar
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-foreground/85">
                            Tutorial lengkap dan panduan untuk memaksimalkan penggunaan CredBar.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tutorials Grid */}
            <section className="relative mx-auto max-w-7xl px-4 py-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Video Tutorial</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutorials.map((tutorial, idx) => {
                        const Icon = tutorial.icon
                        return (
                            <motion.div
                                key={tutorial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative rounded-2xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-all hover:shadow-[0_10px_50px_rgba(0,0,0,0.1)] hover:border-white/50"
                            >
                                {/* Thumbnail */}
                                <div
                                    className={`relative h-40 bg-gradient-to-br ${tutorial.color} flex items-center justify-center overflow-hidden`}
                                >
                                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="relative z-10 rounded-full bg-white/20 p-4 backdrop-blur-sm"
                                    >
                                        <Play className="h-8 w-8 text-white fill-white" />
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <Icon className="h-5 w-5 text-gray-600" />
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                            {tutorial.level}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                                    <p className="text-sm text-gray-700 mb-4">{tutorial.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">{tutorial.duration}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#2A8757] hover:text-[#256c47] hover:bg-transparent"
                                        >
                                            Tonton →
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative mx-auto max-w-3xl px-4 py-24">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pertanyaan Umum</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="rounded-xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                                <h3 className="text-left font-semibold text-gray-900">{faq.question}</h3>
                                <motion.div animate={{ rotate: expandedFaq === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <HelpCircle className="h-5 w-5 text-gray-600" />
                                </motion.div>
                            </button>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedFaq === idx ? "auto" : 0,
                                    opacity: expandedFaq === idx ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 py-4 border-t border-white/20 bg-white/5 text-gray-700">{faq.answer}</div>
                            </motion.div>
                        </motion.div>
                    ))}
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Masih Ada Pertanyaan?</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                        Hubungi tim support kami yang siap membantu Anda 24/7.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full px-9 py-6 text-base font-semibold bg-[#2A8757] hover:bg-[#256c47] text-white shadow-lg hover:shadow-xl transition-all"
                    >
                        <Link href="/login">Hubungi Support</Link>
                    </Button>
                </motion.div>
            </section>

            <SiteFooter />
        </main>
    )
}
