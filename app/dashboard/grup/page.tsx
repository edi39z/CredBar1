"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Edit2, Trash2, Users, DollarSign, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Member {
    id: string
    nama: string
    email: string
    status: "lunas" | "menunggu" | "terlambat"
    tanggalBayar?: string
    nominal: number
}

interface Grup {
    id: string
    nama: string
    deskripsi: string
    nominal: number
    tanggalJatuhTempo: string
    jumlahAnggota: number
    totalTerkumpul: number
    status: "aktif" | "selesai"
    role: "admin" | "member"
    members: Member[]
    createdAt: string
}

export default function GrupPage() {
    const [groups, setGroups] = useState<Grup[]>([
        {
            id: "1",
            nama: "Iuran WiFi Kos Jl. Merdeka",
            deskripsi: "Iuran WiFi bulanan untuk kos bersama",
            nominal: 50000,
            tanggalJatuhTempo: "2025-11-01",
            jumlahAnggota: 5,
            totalTerkumpul: 250000,
            status: "aktif",
            role: "admin",
            createdAt: "2025-01-15",
            members: [
                {
                    id: "m1",
                    nama: "Anda (Admin)",
                    email: "admin@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-25",
                    nominal: 50000,
                },
                {
                    id: "m2",
                    nama: "Budi Santoso",
                    email: "budi@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-26",
                    nominal: 50000,
                },
                {
                    id: "m3",
                    nama: "Citra Dewi",
                    email: "citra@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-27",
                    nominal: 50000,
                },
                { id: "m4", nama: "Doni Hermawan", email: "doni@example.com", status: "menunggu", nominal: 50000 },
                { id: "m5", nama: "Eka Putri", email: "eka@example.com", status: "terlambat", nominal: 50000 },
            ],
        },
        {
            id: "2",
            nama: "Arisan Bulanan Komunitas",
            deskripsi: "Arisan bulanan untuk kebutuhan bersama",
            nominal: 100000,
            tanggalJatuhTempo: "2025-11-05",
            jumlahAnggota: 8,
            totalTerkumpul: 600000,
            status: "aktif",
            role: "admin",
            createdAt: "2025-02-10",
            members: [
                {
                    id: "m1",
                    nama: "Anda (Admin)",
                    email: "admin@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-20",
                    nominal: 100000,
                },
                {
                    id: "m2",
                    nama: "Fajar Wijaya",
                    email: "fajar@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-21",
                    nominal: 100000,
                },
                {
                    id: "m3",
                    nama: "Gita Sari",
                    email: "gita@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-22",
                    nominal: 100000,
                },
                {
                    id: "m4",
                    nama: "Hendra Kusuma",
                    email: "hendra@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-23",
                    nominal: 100000,
                },
                {
                    id: "m5",
                    nama: "Indah Lestari",
                    email: "indah@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-24",
                    nominal: 100000,
                },
                { id: "m6", nama: "Joko Suryanto", email: "joko@example.com", status: "menunggu", nominal: 100000 },
                { id: "m7", nama: "Karina Melati", email: "karina@example.com", status: "menunggu", nominal: 100000 },
                { id: "m8", nama: "Lina Handoko", email: "lina@example.com", status: "terlambat", nominal: 100000 },
            ],
        },
        {
            id: "3",
            nama: "Iuran Listrik Apartemen",
            deskripsi: "Iuran listrik bersama apartemen",
            nominal: 75000,
            tanggalJatuhTempo: "2025-11-10",
            jumlahAnggota: 6,
            totalTerkumpul: 375000,
            status: "aktif",
            role: "member",
            createdAt: "2025-03-05",
            members: [
                {
                    id: "m1",
                    nama: "Mitra Admin",
                    email: "admin2@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-18",
                    nominal: 75000,
                },
                {
                    id: "m2",
                    nama: "Anda (Member)",
                    email: "member@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-19",
                    nominal: 75000,
                },
                {
                    id: "m3",
                    nama: "Nanda Pratama",
                    email: "nanda@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-20",
                    nominal: 75000,
                },
                {
                    id: "m4",
                    nama: "Oki Setiawan",
                    email: "oki@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-21",
                    nominal: 75000,
                },
                { id: "m5", nama: "Prita Sari", email: "prita@example.com", status: "menunggu", nominal: 75000 },
                { id: "m6", nama: "Qori Ramadhan", email: "qori@example.com", status: "menunggu", nominal: 75000 },
            ],
        },
        {
            id: "4",
            nama: "Iuran Kebersihan Lingkungan",
            deskripsi: "Iuran kebersihan dan pemeliharaan lingkungan",
            nominal: 30000,
            tanggalJatuhTempo: "2025-11-15",
            jumlahAnggota: 10,
            totalTerkumpul: 210000,
            status: "aktif",
            role: "member",
            createdAt: "2025-04-12",
            members: [
                {
                    id: "m1",
                    nama: "Rudi Hartono",
                    email: "rudi@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-15",
                    nominal: 30000,
                },
                {
                    id: "m2",
                    nama: "Anda (Member)",
                    email: "member@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-16",
                    nominal: 30000,
                },
                {
                    id: "m3",
                    nama: "Siti Nurhaliza",
                    email: "siti@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-17",
                    nominal: 30000,
                },
                {
                    id: "m4",
                    nama: "Toni Wijaya",
                    email: "toni@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-18",
                    nominal: 30000,
                },
                {
                    id: "m5",
                    nama: "Usman Harahap",
                    email: "usman@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-19",
                    nominal: 30000,
                },
                {
                    id: "m6",
                    nama: "Vina Kusuma",
                    email: "vina@example.com",
                    status: "lunas",
                    tanggalBayar: "2025-10-20",
                    nominal: 30000,
                },
                { id: "m7", nama: "Wawan Setiawan", email: "wawan@example.com", status: "menunggu", nominal: 30000 },
                { id: "m8", nama: "Xenia Putri", email: "xenia@example.com", status: "menunggu", nominal: 30000 },
                { id: "m9", nama: "Yusuf Rahman", email: "yusuf@example.com", status: "menunggu", nominal: 30000 },
                { id: "m10", nama: "Zara Malik", email: "zara@example.com", status: "terlambat", nominal: 30000 },
            ],
        },
    ])

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        nama: "",
        deskripsi: "",
        nominal: "",
        tanggalJatuhTempo: "",
    })

    const handleOpenModal = (grup?: Grup) => {
        if (grup) {
            setEditingId(grup.id)
            setFormData({
                nama: grup.nama,
                deskripsi: grup.deskripsi,
                nominal: grup.nominal.toString(),
                tanggalJatuhTempo: grup.tanggalJatuhTempo,
            })
        } else {
            setEditingId(null)
            setFormData({
                nama: "",
                deskripsi: "",
                nominal: "",
                tanggalJatuhTempo: "",
            })
        }
        setShowModal(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingId) {
            setGroups(
                groups.map((g) =>
                    g.id === editingId
                        ? {
                            ...g,
                            nama: formData.nama,
                            deskripsi: formData.deskripsi,
                            nominal: Number.parseInt(formData.nominal),
                            tanggalJatuhTempo: formData.tanggalJatuhTempo,
                        }
                        : g,
                ),
            )
        } else {
            const newGrup: Grup = {
                id: Date.now().toString(),
                nama: formData.nama,
                deskripsi: formData.deskripsi,
                nominal: Number.parseInt(formData.nominal),
                tanggalJatuhTempo: formData.tanggalJatuhTempo,
                jumlahAnggota: 1,
                totalTerkumpul: 0,
                status: "aktif",
                role: "admin",
                createdAt: new Date().toISOString().split("T")[0],
                members: [
                    {
                        id: "m1",
                        nama: "Anda (Admin)",
                        email: "admin@example.com",
                        status: "lunas",
                        tanggalBayar: new Date().toISOString().split("T")[0],
                        nominal: Number.parseInt(formData.nominal),
                    },
                ],
            }
            setGroups([...groups, newGrup])
        }

        setShowModal(false)
        setFormData({
            nama: "",
            deskripsi: "",
            nominal: "",
            tanggalJatuhTempo: "",
        })
    }

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus grup ini?")) {
            setGroups(groups.filter((g) => g.id !== id))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "lunas":
                return "bg-green-100 text-green-700"
            case "menunggu":
                return "bg-yellow-100 text-yellow-700"
            case "terlambat":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "lunas":
                return "Lunas"
            case "menunggu":
                return "Menunggu"
            case "terlambat":
                return "Terlambat"
            default:
                return status
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manajemen Grup</h1>
                        <p className="text-gray-600 mt-2">Kelola semua grup iuran Anda</p>
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 w-full md:w-auto"
                    >
                        <Plus size={20} />
                        Buat Grup Baru
                    </Button>
                </div>

                {/* Grup Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {groups.map((grup) => {
                        const lunas = grup.members.filter((m) => m.status === "lunas").length
                        const menunggu = grup.members.filter((m) => m.status === "menunggu").length
                        const terlambat = grup.members.filter((m) => m.status === "terlambat").length

                        return (
                            <Card
                                key={grup.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-0"
                            >
                                {/* Card Header with Color */}
                                <div
                                    className={`h-3 ${grup.status === "aktif"
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                                        }`}
                                />

                                <div className="p-6">
                                    {/* Header dengan Role Badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{grup.nama}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{grup.deskripsi}</p>
                                        </div>
                                        {grup.role === "admin" && (
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Shield size={14} />
                                                Admin
                                            </div>
                                        )}
                                    </div>

                                    {/* Grup Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign size={16} className="text-blue-500" />
                                                <span className="text-xs text-gray-600">Nominal</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">Rp {grup.nominal.toLocaleString("id-ID")}</p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={16} className="text-green-500" />
                                                <span className="text-xs text-gray-600">Anggota</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{grup.jumlahAnggota} orang</p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar size={16} className="text-purple-500" />
                                                <span className="text-xs text-gray-600">Jatuh Tempo</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {new Date(grup.tanggalJatuhTempo).toLocaleDateString("id-ID", {
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
                                            <p className="font-bold text-gray-900 text-sm">
                                                Rp {grup.totalTerkumpul.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-700">Progress Pembayaran</span>
                                            <span className="text-xs font-bold text-blue-600">
                                                {Math.round((grup.totalTerkumpul / (grup.nominal * grup.jumlahAnggota)) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min((grup.totalTerkumpul / (grup.nominal * grup.jumlahAnggota)) * 100, 100)}%`,
                                                }}
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
                                            <p className="text-xs text-gray-600">Terlambat</p>
                                            <p className="font-bold text-red-600">{terlambat}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/grup/${grup.id}`} className="flex-1">
                                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2">
                                                <Users size={16} />
                                                Lihat Detail
                                            </Button>
                                        </Link>
                                        {grup.role === "admin" && (
                                            <>
                                                <Button
                                                    onClick={() => handleOpenModal(grup)}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(grup.id)}
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? "Edit Grup" : "Buat Grup Baru"}</h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Grup</label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: Iuran WiFi Kos"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                        <Input
                                            type="text"
                                            placeholder="Deskripsi grup iuran"
                                            value={formData.deskripsi}
                                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Iuran (Rp)</label>
                                        <Input
                                            type="number"
                                            placeholder="50000"
                                            value={formData.nominal}
                                            onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
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
                                            {editingId ? "Simpan Perubahan" : "Buat Grup"}
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
