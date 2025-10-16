"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Users,
    DollarSign,
    TrendingUp,
    MessageSquare,
    FileText,
    Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
    judul: string
    deskripsi: string
    nominalTotal: number
    nomorRekening: string
    qrCode?: string
    tanggalJatuhTempo: string
    members: IuranMember[]
    createdAt: string
}

interface Member {
    id: string
    nama: string
    email: string
    role: "admin" | "member"
}

interface Grup {
    id: string
    nama: string
    deskripsi: string
    members: Member[]
    iurans: Iuran[]
    createdAt: string
}

const allGroups: Grup[] = [
    {
        id: "1",
        nama: "Kos Barnibar",
        deskripsi: "Iuran untuk kos bersama Barnibar",
        createdAt: "2025-01-15",
        members: [
            { id: "m1", nama: "Anda (Admin)", email: "admin@example.com", role: "admin" },
            { id: "m2", nama: "Barni Wijaya", email: "barni@example.com", role: "member" },
            { id: "m3", nama: "Asep Suryanto", email: "asep@example.com", role: "member" },
            { id: "m4", nama: "Citra Dewi", email: "citra@example.com", role: "member" },
            { id: "m5", nama: "Doni Hermawan", email: "doni@example.com", role: "member" },
            { id: "m6", nama: "Eka Putri", email: "eka@example.com", role: "member" },
        ],
        iurans: [
            {
                id: "i1",
                judul: "WiFi Bulanan",
                deskripsi: "Iuran WiFi untuk kos bersama",
                nominalTotal: 300000,
                nomorRekening: "1234567890 (BCA)",
                qrCode: "https://via.placeholder.com/200?text=WiFi+QR",
                tanggalJatuhTempo: "2025-11-01",
                createdAt: "2025-10-01",
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
                judul: "Listrik Bulanan",
                deskripsi: "Iuran listrik untuk kos bersama",
                nominalTotal: 600000,
                nomorRekening: "0987654321 (Mandiri)",
                qrCode: "https://via.placeholder.com/200?text=Listrik+QR",
                tanggalJatuhTempo: "2025-11-05",
                createdAt: "2025-10-02",
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
        ],
    },
]

export default function GrupDetailPage() {
    const params = useParams()
    const router = useRouter()
    const grupId = params.id as string

    const [grup, setGrup] = useState<Grup | null>(allGroups.find((g) => g.id === grupId) || null)
    const [activeTab, setActiveTab] = useState<"overview" | "iuran" | "anggota">("overview")
    const [selectedIuran, setSelectedIuran] = useState<Iuran | null>(null)
    const [showIuranModal, setShowIuranModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState<IuranMember | null>(null)

    const [iuranForm, setIuranForm] = useState({
        judul: "",
        deskripsi: "",
        nominalTotal: "",
        nomorRekening: "",
        tanggalJatuhTempo: "",
    })

    const [paymentForm, setPaymentForm] = useState({
        nominal: "",
        catatan: "",
        buktiPembayaran: "",
    })

    const isAdmin = grup?.members.some((m) => m.role === "admin" && m.nama.includes("Anda"))

    if (!grup) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <Button
                        onClick={() => router.back()}
                        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Kembali
                    </Button>
                    <Card className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-gray-600">Grup tidak ditemukan</p>
                    </Card>
                </div>
            </div>
        )
    }

    const totalIuran = grup.iurans.length
    const totalTerkumpul = grup.iurans.reduce((sum, iuran) => {
        const lunas = iuran.members.filter((m) => m.status === "lunas").reduce((s, m) => s + m.nominal, 0)
        return sum + lunas
    }, 0)
    const totalBelumBayar = grup.iurans.reduce((sum, iuran) => {
        const belum = iuran.members.filter((m) => m.status !== "lunas").reduce((s, m) => s + m.nominal, 0)
        return sum + belum
    }, 0)

    const recentActivities = grup.iurans
        .flatMap((iuran) =>
            iuran.members.map((member) => ({
                id: member.id,
                nama: member.nama,
                iuran: iuran.judul,
                nominal: member.nominal,
                status: member.status,
                tanggal: member.tanggalBayar || iuran.createdAt,
            })),
        )
        .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
        .slice(0, 5)

    const handleAddIuran = (e: React.FormEvent) => {
        e.preventDefault()
        const newIuran: Iuran = {
            id: Date.now().toString(),
            judul: iuranForm.judul,
            deskripsi: iuranForm.deskripsi,
            nominalTotal: Number.parseInt(iuranForm.nominalTotal),
            nomorRekening: iuranForm.nomorRekening,
            tanggalJatuhTempo: iuranForm.tanggalJatuhTempo,
            createdAt: new Date().toISOString().split("T")[0],
            members: [],
        }
        setGrup({ ...grup, iurans: [...grup.iurans, newIuran] })
        setShowIuranModal(false)
        setIuranForm({ judul: "", deskripsi: "", nominalTotal: "", nomorRekening: "", tanggalJatuhTempo: "" })
    }

    const handleDeleteIuran = (iuranId: string) => {
        if (confirm("Hapus iuran ini?")) {
            setGrup({ ...grup, iurans: grup.iurans.filter((i) => i.id !== iuranId) })
            setSelectedIuran(null)
        }
    }

    const handleAddMemberToIuran = (memberId: string) => {
        if (!selectedIuran) return
        const member = grup.members.find((m) => m.id === memberId)
        if (!member) return

        const nominalPerOrang = Math.floor(selectedIuran.nominalTotal / 3) // Contoh: dibagi 3 orang
        const newMember: IuranMember = {
            id: Date.now().toString(),
            memberId,
            nama: member.nama,
            nominal: nominalPerOrang,
            status: "belum_bayar",
        }

        const updatedIuran = {
            ...selectedIuran,
            members: [...selectedIuran.members, newMember],
        }
        setSelectedIuran(updatedIuran)
        setGrup({
            ...grup,
            iurans: grup.iurans.map((i) => (i.id === selectedIuran.id ? updatedIuran : i)),
        })
    }

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMember || !selectedIuran) return

        const updatedMember = {
            ...selectedMember,
            nominal: Number.parseInt(paymentForm.nominal),
            status: "menunggu_konfirmasi" as const,
            tanggalBayar: new Date().toISOString().split("T")[0],
            buktiPembayaran: paymentForm.buktiPembayaran,
            catatan: paymentForm.catatan,
        }

        const updatedIuran = {
            ...selectedIuran,
            members: selectedIuran.members.map((m) => (m.id === selectedMember.id ? updatedMember : m)),
        }

        setSelectedIuran(updatedIuran)
        setGrup({
            ...grup,
            iurans: grup.iurans.map((i) => (i.id === selectedIuran.id ? updatedIuran : i)),
        })

        setShowPaymentModal(false)
        setPaymentForm({ nominal: "", catatan: "", buktiPembayaran: "" })
    }

    const handleConfirmPayment = (memberId: string) => {
        if (!selectedIuran) return

        const updatedIuran = {
            ...selectedIuran,
            members: selectedIuran.members.map((m) => (m.id === memberId ? { ...m, status: "lunas" as const } : m)),
        }

        setSelectedIuran(updatedIuran)
        setGrup({
            ...grup,
            iurans: grup.iurans.map((i) => (i.id === selectedIuran.id ? updatedIuran : i)),
        })
    }

    const handleEditNominal = (memberId: string, newNominal: number) => {
        if (!selectedIuran) return

        const updatedIuran = {
            ...selectedIuran,
            members: selectedIuran.members.map((m) => (m.id === memberId ? { ...m, nominal: newNominal } : m)),
        }

        setSelectedIuran(updatedIuran)
        setGrup({
            ...grup,
            iurans: grup.iurans.map((i) => (i.id === selectedIuran.id ? updatedIuran : i)),
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "lunas":
                return "bg-green-100 text-green-700"
            case "menunggu_konfirmasi":
                return "bg-yellow-100 text-yellow-700"
            case "belum_bayar":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "lunas":
                return "Lunas"
            case "menunggu_konfirmasi":
                return "Menunggu Konfirmasi"
            case "belum_bayar":
                return "Belum Bayar"
            default:
                return status
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Button
                    onClick={() => router.back()}
                    className="mb-6 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </Button>

                {/* Grup Header Card */}
                <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 mb-6">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{grup.nama}</h1>
                                <p className="text-gray-600 mt-2">{grup.deskripsi}</p>
                            </div>
                            {isAdmin && (
                                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 w-fit">
                                    <Crown size={16} />
                                    Admin
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-blue-500" />
                                    <p className="text-xs text-gray-600">Total Iuran</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">{totalIuran}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={16} className="text-green-500" />
                                    <p className="text-xs text-gray-600">Sudah Bayar</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">Rp {totalTerkumpul.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={16} className="text-red-500" />
                                    <p className="text-xs text-gray-600">Belum Bayar</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">Rp {totalBelumBayar.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={16} className="text-purple-500" />
                                    <p className="text-xs text-gray-600">Anggota</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">{grup.members.length}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-3 font-semibold transition-colors ${activeTab === "overview"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("iuran")}
                        className={`px-4 py-3 font-semibold transition-colors ${activeTab === "iuran" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Iuran
                    </button>
                    <button
                        onClick={() => setActiveTab("anggota")}
                        className={`px-4 py-3 font-semibold transition-colors ${activeTab === "anggota" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Anggota
                    </button>
                </div>

                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activities */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
                                    <div className="space-y-3">
                                        {recentActivities.map((activity) => (
                                            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${activity.status === "lunas"
                                                            ? "bg-green-500"
                                                            : activity.status === "menunggu_konfirmasi"
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                        }`}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{activity.nama}</p>
                                                    <p className="text-sm text-gray-600">{activity.iuran}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">Rp {activity.nominal.toLocaleString("id-ID")}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(activity.tanggal).toLocaleDateString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Quick Stats */}
                        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Ringkasan</h3>
                                <div className="space-y-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600 mb-1">Lunas</p>
                                        <p className="font-bold text-green-600 text-lg">
                                            {grup.iurans.reduce((sum, i) => sum + i.members.filter((m) => m.status === "lunas").length, 0)}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600 mb-1">Menunggu Konfirmasi</p>
                                        <p className="font-bold text-yellow-600 text-lg">
                                            {grup.iurans.reduce(
                                                (sum, i) => sum + i.members.filter((m) => m.status === "menunggu_konfirmasi").length,
                                                0,
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600 mb-1">Belum Bayar</p>
                                        <p className="font-bold text-red-600 text-lg">
                                            {grup.iurans.reduce(
                                                (sum, i) => sum + i.members.filter((m) => m.status === "belum_bayar").length,
                                                0,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === "iuran" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Iuran List */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Daftar Iuran</h2>
                                        {isAdmin && (
                                            <Button
                                                onClick={() => setShowIuranModal(true)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Tambah Iuran
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {grup.iurans.map((iuran) => {
                                            const lunas = iuran.members.filter((m) => m.status === "lunas").length
                                            const total = iuran.members.length
                                            const progress = total > 0 ? (lunas / total) * 100 : 0

                                            return (
                                                <div
                                                    key={iuran.id}
                                                    onClick={() => setSelectedIuran(iuran)}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedIuran?.id === iuran.id
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-blue-300 bg-white"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{iuran.judul}</h3>
                                                            <p className="text-sm text-gray-600">{iuran.deskripsi}</p>
                                                        </div>
                                                        {isAdmin && (
                                                            <div className="flex gap-2">
                                                                <button className="text-blue-500 hover:text-blue-700">
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteIuran(iuran.id)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        <div>
                                                            <p className="text-xs text-gray-600">Nominal Total</p>
                                                            <p className="font-bold text-gray-900">Rp {iuran.nominalTotal.toLocaleString("id-ID")}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600">Jatuh Tempo</p>
                                                            <p className="font-bold text-gray-900">
                                                                {new Date(iuran.tanggalJatuhTempo).toLocaleDateString("id-ID", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs font-semibold text-gray-700">Progress</span>
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

                                                    <div className="flex gap-2 text-xs">
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Lunas: {lunas}</span>
                                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                                            Menunggu: {iuran.members.filter((m) => m.status === "menunggu_konfirmasi").length}
                                                        </span>
                                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                                                            Belum: {iuran.members.filter((m) => m.status === "belum_bayar").length}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Iuran Detail */}
                        {selectedIuran && (
                            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">Detail Iuran</h3>
                                        <button onClick={() => setSelectedIuran(null)} className="text-gray-500 hover:text-gray-700">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Judul</p>
                                            <p className="font-bold text-gray-900">{selectedIuran.judul}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Deskripsi</p>
                                            <p className="text-gray-700">{selectedIuran.deskripsi}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Nomor Rekening</p>
                                            <p className="font-bold text-gray-900">{selectedIuran.nomorRekening}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Jatuh Tempo</p>
                                            <p className="font-bold text-gray-900">
                                                {new Date(selectedIuran.tanggalJatuhTempo).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mb-4">
                                        <h4 className="font-bold text-gray-900 mb-3">Anggota Iuran</h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {selectedIuran.members.map((member) => (
                                                <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{member.nama}</p>
                                                            <p className="text-xs text-gray-600">Rp {member.nominal.toLocaleString("id-ID")}</p>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(member.status)}`}
                                                        >
                                                            {getStatusLabel(member.status)}
                                                        </span>
                                                    </div>

                                                    {member.tanggalBayar && (
                                                        <p className="text-xs text-gray-600 mb-2">
                                                            Bayar: {new Date(member.tanggalBayar).toLocaleDateString("id-ID")}
                                                        </p>
                                                    )}

                                                    {member.catatan && (
                                                        <p className="text-xs text-gray-600 mb-2 italic">Catatan: {member.catatan}</p>
                                                    )}

                                                    <div className="flex gap-2">
                                                        {member.status === "belum_bayar" && (
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedMember(member)
                                                                    setShowPaymentModal(true)
                                                                }}
                                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                                                            >
                                                                Bayar
                                                            </Button>
                                                        )}
                                                        {isAdmin && member.status === "menunggu_konfirmasi" && (
                                                            <Button
                                                                onClick={() => handleConfirmPayment(member.id)}
                                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1"
                                                            >
                                                                Konfirmasi
                                                            </Button>
                                                        )}
                                                        {isAdmin && (
                                                            <Button
                                                                onClick={() => {
                                                                    const newNominal = prompt("Nominal baru:", member.nominal.toString())
                                                                    if (newNominal) {
                                                                        handleEditNominal(member.id, Number.parseInt(newNominal))
                                                                    }
                                                                }}
                                                                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-1"
                                                            >
                                                                Edit Nominal
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="border-t pt-4">
                                            <p className="text-xs text-gray-600 mb-2">Tambah Anggota</p>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddMemberToIuran(e.target.value)
                                                        e.target.value = ""
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            >
                                                <option value="">Pilih Anggota</option>
                                                {grup.members
                                                    .filter((m) => !selectedIuran.members.some((im) => im.memberId === m.id))
                                                    .map((m) => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.nama}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === "anggota" && (
                    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Anggota</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {grup.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-bold text-gray-900">{member.nama}</p>
                                                <p className="text-sm text-gray-600">{member.email}</p>
                                            </div>
                                            {member.role === "admin" && (
                                                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                                                    <Crown size={12} />
                                                    Admin
                                                </div>
                                            )}
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-2 pt-3 border-t">
                                                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1">
                                                    <MessageSquare size={14} />
                                                </Button>
                                                <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-1">
                                                    <Edit2 size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Iuran Modal */}
                {showIuranModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Iuran Baru</h2>

                                <form onSubmit={handleAddIuran} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Iuran</label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: WiFi Bulanan"
                                            value={iuranForm.judul}
                                            onChange={(e) => setIuranForm({ ...iuranForm, judul: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                        <Input
                                            type="text"
                                            placeholder="Deskripsi iuran"
                                            value={iuranForm.deskripsi}
                                            onChange={(e) => setIuranForm({ ...iuranForm, deskripsi: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Total (Rp)</label>
                                        <Input
                                            type="number"
                                            placeholder="300000"
                                            value={iuranForm.nominalTotal}
                                            onChange={(e) => setIuranForm({ ...iuranForm, nominalTotal: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Rekening / QR</label>
                                        <Input
                                            type="text"
                                            placeholder="1234567890 (BCA)"
                                            value={iuranForm.nomorRekening}
                                            onChange={(e) => setIuranForm({ ...iuranForm, nomorRekening: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
                                        <Input
                                            type="date"
                                            value={iuranForm.tanggalJatuhTempo}
                                            onChange={(e) => setIuranForm({ ...iuranForm, tanggalJatuhTempo: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => setShowIuranModal(false)}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                            Buat Iuran
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && selectedMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
                                <p className="text-gray-600 mb-6">{selectedIuran?.judul}</p>

                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Pembayaran (Rp)</label>
                                        <Input
                                            type="number"
                                            placeholder={selectedMember.nominal.toString()}
                                            value={paymentForm.nominal}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, nominal: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
                                        <Input
                                            type="text"
                                            placeholder="Contoh: Sudah transfer"
                                            value={paymentForm.catatan}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, catatan: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bukti Pembayaran (Opsional)
                                        </label>
                                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Upload size={20} className="text-gray-500" />
                                            <span className="text-gray-600">Upload Bukti</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowPaymentModal(false)
                                                setPaymentForm({ nominal: "", catatan: "", buktiPembayaran: "" })
                                            }}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                                            Bayar Sekarang
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
