"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Users, DollarSign, Calendar, Shield, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Due {
  id: number
  roomId: number
  name: string
  description?: string
  amount: number
  isRecurring: boolean
  frequency?: string
  interval?: number
  startDate?: string
  nextDueDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  invoices?: Array<{
    id: string
    status: string
  }>
}

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
  id: string | number
  grupId: string | number
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

export default function IuranPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const [iurans, setIurans] = useState<Iuran[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    isRecurring: false,
    frequency: "MONTHLY",
    interval: "1",
    startDate: "",
    nextDueDate: "",
  })

  useEffect(() => {
    fetchIurans()
  }, [roomId])

  const fetchIurans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/rooms/${roomId}/dues`)
      if (!response.ok) {
        throw new Error("Gagal memuat data iuran")
      }
      const result = await response.json()
      if (result.success) {
        const transformedIurans = result.data.map((due: Due) => ({
          id: due.id,
          grupId: due.roomId,
          grupNama: "Grup",
          judul: due.name,
          deskripsi: due.description || "",
          nominalTotal: due.amount,
          nomorRekening: "",
          tanggalJatuhTempo: due.nextDueDate || new Date().toISOString().split("T")[0],
          members: [],
          createdAt: due.createdAt,
          role: "admin",
        }))
        setIurans(transformedIurans)
      }
    } catch (err) {
      console.error("Error fetching iurans:", err)
      setError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (iuran?: Iuran) => {
    if (iuran) {
      setEditingId(iuran.id)
      setFormData({
        name: iuran.judul,
        description: iuran.deskripsi,
        amount: iuran.nominalTotal.toString(),
        isRecurring: false,
        frequency: "MONTHLY",
        interval: "1",
        startDate: "",
        nextDueDate: iuran.tanggalJatuhTempo,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        description: "",
        amount: "",
        isRecurring: false,
        frequency: "MONTHLY",
        interval: "1",
        startDate: "",
        nextDueDate: "",
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!formData.nextDueDate) {
        throw new Error("Tanggal jatuh tempo harus diisi")
      }

      if (formData.isRecurring && !formData.startDate) {
        throw new Error("Tanggal mulai harus diisi untuk iuran berulang")
      }

      const url = editingId ? `/api/rooms/${roomId}/dues/${editingId}` : `/api/rooms/${roomId}/dues`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          amount: Number.parseInt(formData.amount),
          isRecurring: formData.isRecurring,
          frequency: formData.isRecurring ? formData.frequency : undefined,
          interval: formData.isRecurring ? Number.parseInt(formData.interval) : undefined,
          startDate: formData.startDate || undefined,
          nextDueDate: formData.nextDueDate,
        }),
      })
      if (!response.ok) {
        throw new Error("Gagal menyimpan iuran")
      }
      await fetchIurans()
      setShowModal(false)
      setFormData({
        name: "",
        description: "",
        amount: "",
        isRecurring: false,
        frequency: "MONTHLY",
        interval: "1",
        startDate: "",
        nextDueDate: "",
      })
    } catch (err) {
      console.error("Error submitting form:", err)
      alert(err instanceof Error ? err.message : "Gagal menyimpan iuran")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (confirm("Apakah Anda yakin ingin menghapus iuran ini?")) {
      try {
        const response = await fetch(`/api/rooms/${roomId}/dues/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Gagal menghapus iuran")
        }
        await fetchIurans()
      } catch (err) {
        console.error("Error deleting iuran:", err)
        alert(err instanceof Error ? err.message : "Gagal menghapus iuran")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Memuat data iuran...</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Kembali
        </Button>

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

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {/* Iuran Cards Grid */}
        {iurans.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Belum ada iuran. Buat iuran baru untuk memulai.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {iurans.map((iuran) => {
              const lunas = iuran.members.filter((m) => m.status === "lunas").length
              const menunggu = iuran.members.filter((m) => m.status === "menunggu_konfirmasi").length
              const belumBayar = iuran.members.filter((m) => m.status === "belum_bayar").length
              const total = iuran.members.length
              const progress = total > 0 ? (lunas / total) * 100 : 0
              const totalLunas = iuran.members
                .filter((m) => m.status === "lunas")
                .reduce((sum, m) => sum + m.nominal, 0)
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
                        <p className="font-bold text-gray-900 text-sm">
                          Rp {iuran.nominalTotal.toLocaleString("id-ID")}
                        </p>
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
                      <Link href={`/dashboard/grup/${roomId}/iuran/${iuran.id}`} className="flex-1">
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
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? "Edit Iuran" : "Buat Iuran Baru"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Iuran</label>
                    <Input
                      type="text"
                      placeholder="Contoh: WiFi Bulanan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                    <Input
                      type="text"
                      placeholder="Deskripsi iuran"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Total (Rp)</label>
                    <Input
                      type="number"
                      placeholder="300000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Jatuh Tempo *</label>
                    <Input
                      type="date"
                      value={formData.nextDueDate}
                      onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-semibold text-gray-700">Iuran Berulang</span>
                    </label>

                    {formData.isRecurring && (
                      <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai *</label>
                          <Input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Frekuensi</label>
                          <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="DAILY">Harian</option>
                            <option value="WEEKLY">Mingguan</option>
                            <option value="MONTHLY">Bulanan</option>
                            <option value="QUARTERLY">Triwulanan</option>
                            <option value="YEARLY">Tahunan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Interval</label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={formData.interval}
                            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Contoh: setiap 1 bulan, 2 minggu, dll</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Iuran"}
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
