"use client"

import Image from "next/image"

const items = [
    {
        title: "1. Buat Grup dalam Sekejap.",
        desc: "Beri nama grupmu, undang anggota via link atau email, dan atur admin. Hanya butuh kurang dari 1 menit.",
        img: "/form-buat-room-baru.jpg",
        reverse: false,
    },
    {
        title: "2. Atur Iuran Berulang.",
        desc: "Tagihan bulanan seperti WiFi, listrik, atau uang kas? Atur sekali saja, CredBar akan otomatis membuat tagihan tiap bulan.",
        img: "/form-iuran-bulanan.jpg",
        reverse: true,
    },
    {
        title: "3. Lacak dan Konfirmasi Pembayaran.",
        desc: "Lihat siapa saja yang sudah membayar. Anggota unggah bukti transfer, admin tinggal konfirmasi.",
        img: "/dashboard-status-pembayaran.jpg",
        reverse: false,
    },
]

export function Features() {
    return (
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 space-y-8">
            {items.map((it, idx) => (
                <div
                    key={idx}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${it.reverse ? "md:[&>div:first-child]:order-2" : ""
                        }`}
                >
                    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-xl">
                        <h3 className="text-xl font-semibold">{it.title}</h3>
                        <p className="mt-2 text-foreground/80">{it.desc}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-3 shadow-xl">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                            <Image src={it.img || "/placeholder.svg"} alt={it.title} fill className="object-cover" />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}
