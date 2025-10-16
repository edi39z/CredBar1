"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Transaksi {
    id: string
    tipe: "masuk" | "keluar"
    deskripsi: string
    nominal: number
    tanggal: string
    kategori: string
    namaGrup: string
}

export default function TransaksiPage() {
    const [transactions, setTransactions] = useState<Transaksi[]>([
        {
            id: "1",
            tipe: "masuk",
            deskripsi: "Pembayaran iuran WiFi dari Budi",
            nominal: 50000,
            tanggal: "2025-10-31",
            kategori: "Iuran",
            namaGrup: "Iuran WiFi Kos",
        },
        {
            id: "2",
            tipe: "keluar",
            deskripsi: "Pembayaran tagihan WiFi",
            nominal: 250000,
            tanggal: "2025-10-30",
            kategori: "Pengeluaran",
            namaGrup: "Iuran WiFi Kos",
        },
        {
            id: "3",
            tipe: "masuk",
            deskripsi: "Pembayaran arisan dari Siti",
            nominal: 100000,
            tanggal: "2025-10-29",
            kategori: "Arisan",
            namaGrup: "Arisan Bulanan",
        },
        {
            id: "4",
            tipe: "masuk",
            deskripsi: "Pembayaran iuran WiFi dari Ahmad",
            nominal: 50000,
            tanggal: "2025-10-28",
            kategori: "Iuran",
            namaGrup: "Iuran WiFi Kos",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [filterTipe, setFilterTipe] = useState<"semua" | "masuk" | "keluar">("semua")

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.namaGrup.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterTipe === "semua" || t.tipe === filterTipe
        return matchesSearch && matchesFilter
    })

    const totalMasuk = transactions.filter((t) => t.tipe === "masuk").reduce((sum, t) => sum + t.nominal, 0)

    const totalKeluar = transactions.filter((t) => t.tipe === "keluar").reduce((sum, t) => sum + t.nominal, 0)

    const saldo = totalMasuk - totalKeluar

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Riwayat Transaksi</h1>
                    <p className="text-gray-600 mt-2">Lihat semua transaksi masuk dan keluar</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg border-0 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Masuk</p>
                                <p className="text-3xl font-bold mt-2">Rp {totalMasuk.toLocaleString("id-ID")}</p>
                            </div>
                            <ArrowDownLeft size={40} className="opacity-30" />
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg border-0 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Total Keluar</p>
                                <p className="text-3xl font-bold mt-2">Rp {totalKeluar.toLocaleString("id-ID")}</p>
                            </div>
                            <ArrowUpRight size={40} className="opacity-30" />
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border-0 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Saldo</p>
                                <p className="text-3xl font-bold mt-2">Rp {saldo.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="text-4xl opacity-30">💰</div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <Input
                            type="text"
                            placeholder="Cari transaksi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["semua", "masuk", "keluar"] as const).map((tipe) => (
                            <Button
                                key={tipe}
                                onClick={() => setFilterTipe(tipe)}
                                className={`capitalize ${filterTipe === tipe
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {tipe === "semua" ? "Semua" : tipe === "masuk" ? "Masuk" : "Keluar"}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                    {filteredTransactions.map((transaksi) => (
                        <Card
                            key={transaksi.id}
                            className="bg-white rounded-xl shadow-md border-0 p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${transaksi.tipe === "masuk" ? "bg-green-100" : "bg-red-100"
                                            }`}
                                    >
                                        {transaksi.tipe === "masuk" ? (
                                            <ArrowDownLeft className="text-green-600" size={24} />
                                        ) : (
                                            <ArrowUpRight className="text-red-600" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{transaksi.deskripsi}</p>
                                        <p className="text-sm text-gray-600">{transaksi.namaGrup}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${transaksi.tipe === "masuk" ? "text-green-600" : "text-red-600"}`}>
                                        {transaksi.tipe === "masuk" ? "+" : "-"} Rp {transaksi.nominal.toLocaleString("id-ID")}
                                    </p>
                                    <p className="text-xs text-gray-500">{new Date(transaksi.tanggal).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
