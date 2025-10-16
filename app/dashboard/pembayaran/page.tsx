"use client"

import { useState } from "react"
import { CheckCircle, Clock, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Pembayaran {
    id: string
    namaAnggota: string
    namaGrup: string
    nominal: number
    tanggalJatuhTempo: string
    tanggalBayar?: string
    status: "lunas" | "menunggu" | "terlambat"
}

export default function PembayaranPage() {
    const [payments, setPayments] = useState<Pembayaran[]>([
        {
            id: "1",
            namaAnggota: "Budi Santoso",
            namaGrup: "Iuran WiFi Kos",
            nominal: 50000,
            tanggalJatuhTempo: "2025-11-01",
            tanggalBayar: "2025-10-31",
            status: "lunas",
        },
        {
            id: "2",
            namaAnggota: "Siti Nurhaliza",
            namaGrup: "Iuran WiFi Kos",
            nominal: 50000,
            tanggalJatuhTempo: "2025-11-01",
            status: "menunggu",
        },
        {
            id: "3",
            namaAnggota: "Ahmad Wijaya",
            namaGrup: "Arisan Bulanan",
            nominal: 100000,
            tanggalJatuhTempo: "2025-11-05",
            status: "terlambat",
        },
    ])

    const [filterStatus, setFilterStatus] = useState<"semua" | "lunas" | "menunggu" | "terlambat">("semua")

    const filteredPayments = filterStatus === "semua" ? payments : payments.filter((p) => p.status === filterStatus)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "lunas":
                return "bg-green-100 text-green-800 border-green-300"
            case "menunggu":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "terlambat":
                return "bg-red-100 text-red-800 border-red-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "lunas":
                return <CheckCircle size={20} className="text-green-600" />
            case "menunggu":
                return <Clock size={20} className="text-yellow-600" />
            case "terlambat":
                return <AlertCircle size={20} className="text-red-600" />
            default:
                return null
        }
    }

    const stats = [
        {
            label: "Total Pembayaran",
            value: payments.length,
            color: "bg-blue-500",
            icon: "📊",
        },
        {
            label: "Lunas",
            value: payments.filter((p) => p.status === "lunas").length,
            color: "bg-green-500",
            icon: "✓",
        },
        {
            label: "Menunggu",
            value: payments.filter((p) => p.status === "menunggu").length,
            color: "bg-yellow-500",
            icon: "⏳",
        },
        {
            label: "Terlambat",
            value: payments.filter((p) => p.status === "terlambat").length,
            color: "bg-red-500",
            icon: "⚠️",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manajemen Pembayaran</h1>
                    <p className="text-gray-600 mt-2">Pantau status pembayaran iuran semua anggota</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="bg-white rounded-xl shadow-md border-0 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div
                                    className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(["semua", "lunas", "menunggu", "terlambat"] as const).map((status) => (
                        <Button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`capitalize ${filterStatus === status
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {status === "semua"
                                ? "Semua"
                                : status === "lunas"
                                    ? "Lunas"
                                    : status === "menunggu"
                                        ? "Menunggu"
                                        : "Terlambat"}
                        </Button>
                    ))}
                </div>

                {/* Payments Table */}
                <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Nama Anggota</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Grup</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Nominal</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Jatuh Tempo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.namaAnggota}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{payment.namaGrup}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            Rp {payment.nominal.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(payment.tanggalJatuhTempo).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(payment.status)}`}
                                            >
                                                {getStatusIcon(payment.status)}
                                                <span className="text-xs font-semibold capitalize">
                                                    {payment.status === "lunas"
                                                        ? "Lunas"
                                                        : payment.status === "menunggu"
                                                            ? "Menunggu"
                                                            : "Terlambat"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Detail</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Export Button */}
                <div className="mt-6 flex justify-end">
                    <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                        <Download size={20} />
                        Export ke Excel
                    </Button>
                </div>
            </div>
        </div>
    )
}
