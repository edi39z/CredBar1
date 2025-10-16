"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Edit2, Trash2, Users, DollarSign, Calendar, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface IuranMember {
    id: string
    memberId: string
    nama: string
    nominal: number
    status: "lunas" | "menunggu_konfirmasi" | "belum_bayar"
    tanggalBayar?: string
    buktiPembayaran?: string
    catatan?: string
}

interface Iuran {
    id: string
    grupId: string
    grupNama: string
    judul: string
    deskripsi: string
    nominalTotal: number
    nomorRekening: string
    qrCode?: string
    tanggalJatuhTempo: string
    members: IuranMember[]
    createdAt: string
    role: "admin" | "member"
}

const allIurans: Iuran[] = [
    {
        id: "i1",
        grupId: "1",
        grupNama: "Kos Barnibar",
        judul: "WiFi Bulanan",
        deskripsi: "Iuran WiFi untuk kos bersama",
        nominalTotal: 300000,
        nomorRekening: "1234567890 (BCA)",
        qrCode: "https://via.placeholder.com/200?text=WiFi+QR",
        tanggalJatuhTempo: "2025-11-01",
        createdAt: "2025-10-01",
        role: "admin",
        members: [
            {
                id: "im1",
                memberId: "m1",
                nama: "Anda (Admin)",
                nominal: 100000,
                status: "lunas",
                tanggalBayar: "2025-10-25",
            },
            {
                id: "im2",
                memberId: "m2",
                nama: "Barni Wijaya",
                nominal: 100000,
                status: "lunas",
                tanggalBayar: "2025-10-26",
            },
            {
                id: "im3",
                memberId: "m3",
                nama: "Asep Suryanto",
                nominal: 100000,
                status: "menunggu_konfirmasi",
                tanggalBayar: "2025-10-27",
                buktiPembayaran: "bukti.jpg",
                catatan: "Sudah transfer",
            },
        ],
    },
    {
        id: "i2",
        grupId: "1",
        grupNama: "Kos Barnibar",
        judul: "Listrik Bulanan",
        deskripsi: "Iuran listrik untuk kos bersama",
        nominalTotal: 600000,
        nomorRekening: "0987654321 (Mandiri)",
        qrCode: "https://via.placeholder.com/200?text=Listrik+QR",
        tanggalJatuhTempo: "2025-11-05",
        createdAt: "2025-10-02",
        role: "admin",
        members: [
            {
                id: "im4",
                memberId: "m1",
                nama: "Anda (Admin)",
                nominal: 150000,
                status: "lunas",
                tanggalBayar: "2025-10-20",
            },
            {
                id: "im5",
                memberId: "m2",
                nama: "Barni Wijaya",
                nominal: 150000,
                status: "lunas",
                tanggalBayar: "2025-10-21",
            },
            { id: "im6", memberId: "m3", nama: "Asep Suryanto", nominal: 150000, status: "belum_bayar" },
            {
                id: "im7",
                memberId: "m4",
                nama: "Citra Dewi",
                nominal: 150000,
                status: "menunggu_konfirmasi",
                tanggalBayar: "2025-10-22",
                buktiPembayaran: "bukti2.jpg",
            },
        ],
    },
]

export default function IuranPage() {
    const [iurans, setIurans] = useState<Iuran[]>(allIurans)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        nominalTotal: "",
        nomorRekening: "",
        tanggalJatuhTempo: "",
    })

    const handleOpenModal = (iuran?: Iuran) => {
        if (iuran) {
            setEditingId(iuran.id)
            setFormData({
                judul: iuran.judul,
                deskripsi: iuran.deskripsi,
                nominalTotal: iuran.nominalTotal.toString(),
                nomorRekening: iuran.nomorRekening,
                tanggalJatuhTempo: iuran.tanggalJatuhTempo,
            })
        } else {
            setEditingId(null)
            setFormData({
                judul: "",
                deskripsi: "",
                nominalTotal: "",
                nomorRekening: "",
                tanggalJatuhTempo: "",
            })
        }
        setShowModal(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingId) {
            setIurans(
                iurans.map((i) =>
                    i.id === editingId
                        ? {
                            ...i,
                            judul: formData.judul,
                            deskripsi: formData.deskripsi,
                            nominalTotal: Number.parseInt(formData.nominalTotal),
                            nomorRekening: formData.nomorRekening,
                            tanggalJatuhTempo: formData.tanggalJatuhTempo,
                        }
                        : i,
                ),
            )
        }

        setShowModal(false)
        setFormData({
            judul: "",
            deskripsi: "",
            nominalTotal: "",
            nomorRekening: "",
            tanggalJatuhTempo: "",
        })
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus iuran ini?")) {
            setIurans(iurans.filter((i) => i.id !== id))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Daftar Iuran</h1>
                        <p className="text-gray-600 mt-2">Kelola semua iuran Anda</p>
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 w-full md:w-auto"
                    >
                        <Plus size={20} />
                        Buat Iuran Baru
                    </Button>
                </div>

                {/* Iuran Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {iurans.map((iuran) => {
                        const lunas = iuran.members.filter((m) => m.status === "lunas").length
                        const menunggu = iuran.members.filter((m) => m.status === "menunggu_konfirmasi").length
                        const belumBayar = iuran.members.filter((m) => m.status === "belum_bayar").length
                        const total = iuran.members.length
                        const progress = total > 0 ? (lunas / total) * 100 : 0

                        const totalLunas = iuran.members.filter((m) => m.status === "lunas").reduce((sum, m) => sum + m.nominal, 0)

                        return (
                            <Card
                                key={iuran.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-0"
                            >
                                {/* Card Header with Color */}
                                <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500" />

                                <div className="p-6">
                                    {/* Header dengan Role Badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">{iuran.grupNama}</p>
                                            <h3 className="text-xl font-bold text-gray-900">{iuran.judul}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{iuran.deskripsi}</p>
                                        </div>
                                        {iuran.role === "admin" && (
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Shield size={14} />
                                                Admin
                                            </div>
                                        )}
                                    </div>

                                    {/* Iuran Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign size={16} className="text-blue-500" />
                                                <span className="text-xs text-gray-600">Nominal</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">Rp {iuran.nominalTotal.toLocaleString("id-ID")}</p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={16} className="text-green-500" />
                                                <span className="text-xs text-gray-600">Anggota</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{total} orang</p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar size={16} className="text-purple-500" />
                                                <span className="text-xs text-gray-600">Jatuh Tempo</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {new Date(iuran.tanggalJatuhTempo).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </p>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign size={16} className="text-orange-500" />
                                                <span className="text-xs text-gray-600">Terkumpul</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">Rp {totalLunas.toLocaleString("id-ID")}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-700">Progress Pembayaran</span>
                                            <span className="text-xs font-bold text-blue-600">
                                                {lunas}/{total} ({Math.round(progress)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Summary */}
                                    <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-600">Lunas</p>
                                            <p className="font-bold text-green-600">{lunas}</p>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-600">Menunggu</p>
                                            <p className="font-bold text-yellow-600">{menunggu}</p>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-2">
                                            <p className="text-xs text-gray-600">Belum</p>
                                            <p className="font-bold text-red-600">{belumBayar}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/iuran/${iuran.id}`} className="flex-1">
                                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2">
                                                <ArrowRight size={16} />
                                                Masuk
                                            </Button>
                                        </Link>
                                        {iuran.role === "admin" && (
                                            <>
                                                <Button
                                                    onClick={() => handleOpenModal(iuran)}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(iuran.id)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Hapus
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {editingId ? "Edit Iuran" : "Buat Iuran Baru"}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Iuran</label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: WiFi Bulanan"
                                            value={formData.judul}
                                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                        <Input
                                            type="text"
                                            placeholder="Deskripsi iuran"
                                            value={formData.deskripsi}
                                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Total (Rp)</label>
                                        <Input
                                            type="number"
                                            placeholder="300000"
                                            value={formData.nominalTotal}
                                            onChange={(e) => setFormData({ ...formData, nominalTotal: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Rekening / QR</label>
                                        <Input
                                            type="text"
                                            placeholder="1234567890 (BCA)"
                                            value={formData.nomorRekening}
                                            onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
                                        <Input
                                            type="date"
                                            value={formData.tanggalJatuhTempo}
                                            onChange={(e) => setFormData({ ...formData, tanggalJatuhTempo: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                            {editingId ? "Simpan Perubahan" : "Buat Iuran"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
