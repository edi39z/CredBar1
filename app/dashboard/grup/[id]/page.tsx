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
    Mail,
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
    const [showInviteModal, setShowInviteModal] = useState(false) // Added state for invite modal
    const [selectedMember, setSelectedMember] = useState<IuranMember | null>(null)

    const [inviteForm, setInviteForm] = useState({
        identifier: "", // username or email
    })

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

    const handleInviteMember = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteForm.identifier.trim()) return

        // Check if member already exists
        const memberExists = grup?.members.some(
            (m) => m.email === inviteForm.identifier || m.nama.toLowerCase().includes(inviteForm.identifier.toLowerCase()),
        )

        if (memberExists) {
            alert("Anggota sudah ada di grup ini")
            return
        }

        // Create new member
        const newMember: Member = {
            id: `m${Date.now()}`,
            nama: inviteForm.identifier,
            email: inviteForm.identifier.includes("@") ? inviteForm.identifier : `${inviteForm.identifier}@example.com`,
            role: "member",
        }

        setGrup({ ...grup!, members: [...grup!.members, newMember] })
        setShowInviteModal(false)
        setInviteForm({ identifier: "" })
        alert("Anggota berhasil diundang!")
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
                        onClick={() => setActiveTab(IuranMember ? "iuran" : "overview")}
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
                                                "use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Plus,
    Upload,
    Users,
    DollarSign,
    Crown,
    Send,
    CheckCircle,
    AlertCircle,
    Clock,
    Edit2,
    Trash2,
    X,
    Shield,
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

export default function IuranDetailPage() {
    const params = useParams()
    const router = useRouter()
    const iuranId = params.id as string

    // Find the iuran and grup
    let iuran: Iuran | null = null
    let grup: Grup | null = null

    for (const g of allGroups) {
        const found = g.iurans.find((i) => i.id === iuranId)
        if (found) {
            iuran = found
            grup = g
            break
        }
    }

    const [currentIuran, setCurrentIuran] = useState<Iuran | null>(iuran)
    const [currentGrup, setCurrentGrup] = useState<Grup | null>(grup)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDelegateModal, setShowDelegateModal] = useState(false) // Added state for delegate modal
    const [selectedMember, setSelectedMember] = useState<IuranMember | null>(null)

    const [paymentForm, setPaymentForm] = useState({
        nominal: "",
        catatan: "",
        buktiPembayaran: "",
    })

    const [inviteForm, setInviteForm] = useState({
        memberId: "",
    })

    const [messageForm, setMessageForm] = useState({
        message: "",
    })

    const [delegateForm, setDelegateForm] = useState({
        memberId: "",
    })

    const [editForm, setEditForm] = useState({
        judul: currentIuran?.judul || "",
        deskripsi: currentIuran?.deskripsi || "",
        nominalTotal: currentIuran?.nominalTotal.toString() || "",
        nomorRekening: currentIuran?.nomorRekening || "",
        tanggalJatuhTempo: currentIuran?.tanggalJatuhTempo || "",
    })

    const isAdmin = currentGrup?.members.some((m) => m.role === "admin" && m.nama.includes("Anda"))

    if (!currentIuran || !currentGrup) {
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
                        <p className="text-gray-600">Iuran tidak ditemukan</p>
                    </Card>
                </div>
            </div>
        )
    }

    const totalTerkumpul = currentIuran.members.filter((m) => m.status === "lunas").reduce((sum, m) => sum + m.nominal, 0)
    const totalBelumBayar = currentIuran.members
        .filter((m) => m.status !== "lunas")
        .reduce((sum, m) => sum + m.nominal, 0)
    const lunas = currentIuran.members.filter((m) => m.status === "lunas").length
    const menunggu = currentIuran.members.filter((m) => m.status === "menunggu_konfirmasi").length
    const belumBayar = currentIuran.members.filter((m) => m.status === "belum_bayar").length
    const progress = currentIuran.members.length > 0 ? (lunas / currentIuran.members.length) * 100 : 0

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMember || !currentIuran) return

        const updatedMember = {
            ...selectedMember,
            nominal: Number.parseInt(paymentForm.nominal),
            status: "menunggu_konfirmasi" as const,
            tanggalBayar: new Date().toISOString().split("T")[0],
            buktiPembayaran: paymentForm.buktiPembayaran,
            catatan: paymentForm.catatan,
        }

        const updatedIuran = {
            ...currentIuran,
            members: currentIuran.members.map((m) => (m.id === selectedMember.id ? updatedMember : m)),
        }

        setCurrentIuran(updatedIuran)
        setShowPaymentModal(false)
        setPaymentForm({ nominal: "", catatan: "", buktiPembayaran: "" })
    }

    const handleConfirmPayment = (memberId: string) => {
        if (!currentIuran) return

        const updatedIuran = {
            ...currentIuran,
            members: currentIuran.members.map((m) => (m.id === memberId ? { ...m, status: "lunas" as const } : m)),
        }

        setCurrentIuran(updatedIuran)
    }

    const handleInviteMember = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteForm.memberId || !currentIuran) return

        const member = currentGrup?.members.find((m) => m.id === inviteForm.memberId)
        if (!member) return

        const nominalPerOrang = Math.floor(currentIuran.nominalTotal / (currentIuran.members.length + 1))
        const newMember: IuranMember = {
            id: Date.now().toString(),
            memberId: inviteForm.memberId,
            nama: member.nama,
            nominal: nominalPerOrang,
            status: "belum_bayar",
        }

        const updatedIuran = {
            ...currentIuran,
            members: [...currentIuran.members, newMember],
        }

        setCurrentIuran(updatedIuran)
        setShowInviteModal(false)
        setInviteForm({ memberId: "" })
        alert("Anggota berhasil ditambahkan ke iuran!")
    }

    const handleEditIuran = (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentIuran) return

        const updatedIuran = {
            ...currentIuran,
            judul: editForm.judul,
            deskripsi: editForm.deskripsi,
            nominalTotal: Number.parseInt(editForm.nominalTotal),
            nomorRekening: editForm.nomorRekening,
            tanggalJatuhTempo: editForm.tanggalJatuhTempo,
        }

        setCurrentIuran(updatedIuran)
        setShowEditModal(false)
        alert("Iuran berhasil diperbarui!")
    }

    const handleDelegateAdmin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!delegateForm.memberId || !currentGrup) return

        const updatedMembers = currentGrup.members.map((m) => ({
            ...m,
            role:
                m.id === delegateForm.memberId
                    ? ("admin" as const)
                    : m.role === "admin" && m.nama.includes("Anda")
                        ? ("member" as const)
                        : m.role,
        }))

        setCurrentGrup({ ...currentGrup, members: updatedMembers })
        setShowDelegateModal(false)
        setDelegateForm({ memberId: "" })
        alert("Status admin berhasil dilimpahkan!")
    }

    const handleDeleteIuran = () => {
        if (confirm("Apakah Anda yakin ingin menghapus iuran ini? Tindakan ini tidak dapat dibatalkan.")) {
            alert("Iuran berhasil dihapus!")
            router.back()
        }
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "lunas":
                return <CheckCircle size={16} />
            case "menunggu_konfirmasi":
                return <Clock size={16} />
            case "belum_bayar":
                return <AlertCircle size={16} />
            default:
                return null
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

                {/* Iuran Header Card */}
                <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 mb-6">
                    <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{currentIuran.judul}</h1>
                                <p className="text-gray-600 mt-2">{currentIuran.deskripsi}</p>
                                <p className="text-sm text-gray-500 mt-2">Grup: {currentGrup.nama}</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {isAdmin && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setEditForm({
                                                    judul: currentIuran.judul,
                                                    deskripsi: currentIuran.deskripsi,
                                                    nominalTotal: currentIuran.nominalTotal.toString(),
                                                    nomorRekening: currentIuran.nomorRekening,
                                                    tanggalJatuhTempo: currentIuran.tanggalJatuhTempo,
                                                })
                                                setShowEditModal(true)
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={handleDeleteIuran}
                                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Hapus
                                        </Button>
                                        <Button
                                            onClick={() => setShowDelegateModal(true)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
                                        >
                                            <Shield size={16} />
                                            Delegasi Admin
                                        </Button>
                                    </>
                                )}
                                {isAdmin && (
                                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 w-fit">
                                        <Crown size={16} />
                                        Admin
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={16} className="text-blue-500" />
                                    <p className="text-xs text-gray-600">Total Iuran</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">
                                    Rp {currentIuran.nominalTotal.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <p className="text-xs text-gray-600">Sudah Bayar</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">Rp {totalTerkumpul.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-xs text-gray-600">Belum Bayar</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">Rp {totalBelumBayar.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={16} className="text-purple-500" />
                                    <p className="text-xs text-gray-600">Anggota</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg">{currentIuran.members.length}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Iuran</h2>

                                <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-gray-700">Persentase Pembayaran</span>
                                        <span className="text-2xl font-bold text-green-600">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all shadow-md"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-3">
                                        {lunas} dari {currentIuran.members.length} anggota telah membayar
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={18} className="text-green-600" />
                                            <p className="text-xs text-gray-600">Lunas</p>
                                        </div>
                                        <p className="text-2xl font-bold text-green-600">{lunas}</p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Rp{" "}
                                            {currentIuran.members
                                                .filter((m) => m.status === "lunas")
                                                .reduce((sum, m) => sum + m.nominal, 0)
                                                .toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={18} className="text-yellow-600" />
                                            <p className="text-xs text-gray-600">Menunggu</p>
                                        </div>
                                        <p className="text-2xl font-bold text-yellow-600">{menunggu}</p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Rp{" "}
                                            {currentIuran.members
                                                .filter((m) => m.status === "menunggu_konfirmasi")
                                                .reduce((sum, m) => sum + m.nominal, 0)
                                                .toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle size={18} className="text-red-600" />
                                            <p className="text-xs text-gray-600">Belum Bayar</p>
                                        </div>
                                        <p className="text-2xl font-bold text-red-600">{belumBayar}</p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Rp{" "}
                                            {currentIuran.members
                                                .filter((m) => m.status === "belum_bayar")
                                                .reduce((sum, m) => sum + m.nominal, 0)
                                                .toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Info Card */}
                    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Iuran</h3>
                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 mb-1">Nomor Rekening</p>
                                    <p className="font-bold text-gray-900 text-sm break-all">{currentIuran.nomorRekening}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 mb-1">Jatuh Tempo</p>
                                    <p className="font-bold text-gray-900 text-sm">
                                        {new Date(currentIuran.tanggalJatuhTempo).toLocaleDateString("id-ID", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 mb-1">Dibuat Tanggal</p>
                                    <p className="font-bold text-gray-900 text-sm">
                                        {new Date(currentIuran.createdAt).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Members List */}
                <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Daftar Anggota</h2>
                            <div className="flex gap-2">
                                {isAdmin && (
                                    <>
                                        <Button
                                            onClick={() => setShowInviteModal(true)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Tambah Anggota
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {currentIuran.members.map((member) => {
                                const memberProgress = 100 // Placeholder for individual progress
                                return (
                                    <div
                                        key={member.id}
                                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Member Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {member.nama.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{member.nama}</p>
                                                        <p className="text-sm text-gray-600">Rp {member.nominal.toLocaleString("id-ID")}</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${member.status === "lunas"
                                                                    ? "bg-green-500"
                                                                    : member.status === "menunggu_konfirmasi"
                                                                        ? "bg-yellow-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            style={{
                                                                width:
                                                                    member.status === "lunas"
                                                                        ? "100%"
                                                                        : member.status === "menunggu_konfirmasi"
                                                                            ? "50%"
                                                                            : "0%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Status and Details */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(member.status)}`}
                                                    >
                                                        {getStatusIcon(member.status)}
                                                        {getStatusLabel(member.status)}
                                                    </span>
                                                    {member.tanggalBayar && (
                                                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                            {new Date(member.tanggalBayar).toLocaleDateString("id-ID")}
                                                        </span>
                                                    )}
                                                    {member.catatan && <span className="text-xs text-gray-600 italic">"{member.catatan}"</span>}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                                {member.status === "belum_bayar" && (
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedMember(member)
                                                            setShowPaymentModal(true)
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg"
                                                    >
                                                        Bayar
                                                    </Button>
                                                )}
                                                {isAdmin && member.status === "menunggu_konfirmasi" && (
                                                    <Button
                                                        onClick={() => handleConfirmPayment(member.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-lg"
                                                    >
                                                        Konfirmasi
                                                    </Button>
                                                )}
                                                {isAdmin && (
                                                    <>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedMember(member)
                                                                setShowMessageModal(true)
                                                            }}
                                                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs py-2 px-3 rounded-lg flex items-center gap-1"
                                                        >
                                                            <Send size={14} />
                                                            Pesan
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Card>

                {/* Payment Modal */}
                {showPaymentModal && selectedMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
                                <p className="text-gray-600 mb-6">{currentIuran.judul}</p>

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

                {/* Invite Member Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tambah Anggota ke Iuran</h2>
                                <p className="text-gray-600 mb-6">Pilih anggota grup yang ingin ditambahkan</p>

                                <form onSubmit={handleInviteMember} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Anggota</label>
                                        <select
                                            value={inviteForm.memberId}
                                            onChange={(e) => setInviteForm({ memberId: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Pilih Anggota --</option>
                                            {currentGrup.members
                                                .filter((m) => !currentIuran.members.some((im) => im.memberId === m.id))
                                                .map((m) => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.nama}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowInviteModal(false)
                                                setInviteForm({ memberId: "" })
                                            }}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                            Tambah
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Message Modal */}
                {showMessageModal && selectedMember && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
                                <p className="text-gray-600 mb-6">Ke: {selectedMember.nama}</p>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        alert(`Pesan terkirim ke ${selectedMember.nama}`)
                                        setShowMessageModal(false)
                                        setMessageForm({ message: "" })
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
                                        <textarea
                                            placeholder="Tulis pesan atau invoice..."
                                            value={messageForm.message}
                                            onChange={(e) => setMessageForm({ message: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowMessageModal(false)
                                                setMessageForm({ message: "" })
                                            }}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
                                            Kirim
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Edit Iuran Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Iuran</h2>
                                    <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleEditIuran} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Iuran</label>
                                        <Input
                                            type="text"
                                            value={editForm.judul}
                                            onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                        <Input
                                            type="text"
                                            value={editForm.deskripsi}
                                            onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Total (Rp)</label>
                                        <Input
                                            type="number"
                                            value={editForm.nominalTotal}
                                            onChange={(e) => setEditForm({ ...editForm, nominalTotal: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Rekening / QR</label>
                                        <Input
                                            type="text"
                                            value={editForm.nomorRekening}
                                            onChange={(e) => setEditForm({ ...editForm, nomorRekening: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
                                        <Input
                                            type="date"
                                            value={editForm.tanggalJatuhTempo}
                                            onChange={(e) => setEditForm({ ...editForm, tanggalJatuhTempo: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Delegate Admin Modal */}
                {showDelegateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Delegasi Status Admin</h2>
                                    <button onClick={() => setShowDelegateModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleDelegateAdmin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Anggota</label>
                                        <select
                                            value={delegateForm.memberId}
                                            onChange={(e) => setDelegateForm({ memberId: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Pilih Anggota --</option>
                                            {currentGrup.members
                                                .filter((m) => !m.nama.includes("Anda"))
                                                .map((m) => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.nama}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-xs text-yellow-800">
                                            Perhatian: Anda akan kehilangan status admin setelah melimpahkan ke anggota lain.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowDelegateModal(false)
                                                setDelegateForm({ memberId: "" })
                                            }}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
                                            Delegasi
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



                {activeTab === "anggota" && (
                    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Daftar Anggota</h2>
                                {isAdmin && (
                                    <Button
                                        onClick={() => setShowInviteModal(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Tambah Anggota
                                    </Button>
                                )}
                            </div>
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

                {/* Invite Member Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Undang Anggota</h2>
                                <p className="text-gray-600 mb-6">Masukkan username atau email anggota yang ingin diundang</p>

                                <form onSubmit={handleInviteMember} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Username atau Email</label>
                                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                            <Mail size={20} className="text-gray-500" />
                                            <Input
                                                type="text"
                                                placeholder="Contoh: john_doe atau john@example.com"
                                                value={inviteForm.identifier}
                                                onChange={(e) => setInviteForm({ identifier: e.target.value })}
                                                required
                                                className="flex-1 border-0 focus:outline-none focus:ring-0 px-0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowInviteModal(false)
                                                setInviteForm({ identifier: "" })
                                            }}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                            Undang
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
