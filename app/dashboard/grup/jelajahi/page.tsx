"use client"
import { useState } from "react"
import { Search, Users, Calendar, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface AvailableGrup {
    id: string
    nama: string
    deskripsi: string
    nominal: number
    tanggalJatuhTempo: string
    jumlahAnggota: number
    status: "aktif" | "selesai"
    createdBy: string
    joined?: boolean
}

export default function JelajahiGrupPage() {
    const [groups, setGroups] = useState<AvailableGrup[]>([
        {
            id: "5",
            nama: "Iuran Parkir Gedung",
            deskripsi: "Iuran parkir bulanan untuk gedung perkantoran",
            nominal: 25000,
            tanggalJatuhTempo: "2025-11-20",
            jumlahAnggota: 12,
            status: "aktif",
            createdBy: "Admin Gedung",
            joined: false,
        },
        {
            id: "6",
            nama: "Arisan Keluarga Besar",
            deskripsi: "Arisan bulanan untuk keluarga besar",
            nominal: 150000,
            tanggalJatuhTempo: "2025-11-25",
            jumlahAnggota: 15,
            status: "aktif",
            createdBy: "Ibu Siti",
            joined: false,
        },
        {
            id: "7",
            nama: "Iuran Asuransi Kesehatan",
            deskripsi: "Iuran asuransi kesehatan bersama",
            nominal: 200000,
            tanggalJatuhTempo: "2025-12-01",
            jumlahAnggota: 8,
            status: "aktif",
            createdBy: "Pak Budi",
            joined: false,
        },
        {
            id: "8",
            nama: "Iuran Sekolah Anak",
            deskripsi: "Iuran sekolah dan kegiatan anak-anak",
            nominal: 500000,
            tanggalJatuhTempo: "2025-12-05",
            jumlahAnggota: 20,
            status: "aktif",
            createdBy: "Komite Sekolah",
            joined: false,
        },
        {
            id: "9",
            nama: "Iuran Renovasi Rumah Ibadah",
            deskripsi: "Iuran untuk renovasi dan pemeliharaan rumah ibadah",
            nominal: 100000,
            tanggalJatuhTempo: "2025-12-10",
            jumlahAnggota: 25,
            status: "aktif",
            createdBy: "Pengurus Masjid",
            joined: false,
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [joiningId, setJoiningId] = useState<string | null>(null)

    const filteredGroups = groups.filter(
        (grup) =>
            grup.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grup.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleJoinGroup = async (grupId: string) => {
        setJoiningId(grupId)
        // Simulasi API call
        setTimeout(() => {
            setGroups(groups.map((g) => (g.id === grupId ? { ...g, joined: true, jumlahAnggota: g.jumlahAnggota + 1 } : g)))
            setJoiningId(null)
        }, 1000)
    }

    const daysUntilDue = (dueDate: string) => {
        return Math.max(0, Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Jelajahi Grup</h1>
                    <p className="text-gray-600 mt-2">Temukan dan bergabung dengan grup iuran yang tersedia</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <Input
                            type="text"
                            placeholder="Cari grup berdasarkan nama atau deskripsi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Grup Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((grup) => (
                            <Card
                                key={grup.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-0"
                            >
                                {/* Card Header with Color */}
                                <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500" />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{grup.nama}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{grup.deskripsi}</p>
                                        </div>
                                        {grup.joined && (
                                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ml-2">
                                                <Check size={14} />
                                                Bergabung
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={16} className="text-blue-500" />
                                                <span className="text-xs text-gray-600">Anggota</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{grup.jumlahAnggota}</p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-600 font-semibold">Nominal</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">Rp {(grup.nominal / 1000).toFixed(0)}K</p>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar size={16} className="text-orange-500" />
                                                <span className="text-xs text-gray-600">Hari</span>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">{daysUntilDue(grup.tanggalJatuhTempo)} hari</p>
                                        </div>
                                    </div>

                                    {/* Creator Info */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                                        <p className="text-xs text-gray-600">Dibuat oleh</p>
                                        <p className="font-semibold text-gray-900 text-sm">{grup.createdBy}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {!grup.joined ? (
                                            <Button
                                                onClick={() => handleJoinGroup(grup.id)}
                                                disabled={joiningId === grup.id}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <Plus size={16} />
                                                {joiningId === grup.id ? "Bergabung..." : "Bergabung"}
                                            </Button>
                                        ) : (
                                            <Link href={`/dashboard/grup/${grup.id}`} className="flex-1">
                                                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2">
                                                    <Users size={16} />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600 text-lg">Tidak ada grup yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
