"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Users, DollarSign, TrendingUp, FileText, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface RoomMemberData {
  id: number
  userId: number
  roomId: number
  role: "ADMIN" | "MEMBER"
  status: "ACTIVE" | "INACTIVE"
  user: {
    id: number
    name: string
    email: string
  }
}

interface InvoiceData {
  id: string
  code: string
  roomId: number
  memberId: number
  dueId?: number
  description?: string
  amount: number
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE"
  dueDate: string
  paidDate?: string
  paymentMethod?: string
  member: {
    id: number
    name: string
    email: string
  }
  payments: Array<{
    id: number
    amount: number
    method: string
    paidAt: string
  }>
}

interface DueData {
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
  invoices: InvoiceData[]
}

interface RoomData {
  id: number
  name: string
  type: string
  description?: string
  currency: string
  members: RoomMemberData[]
  dues: DueData[]
  invoices: InvoiceData[]
  createdBy: {
    id: number
    name: string
  }
  createdAt: string
  currentUserRole: "ADMIN" | "MEMBER" | null
}

export default function GrupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const [room, setRoom] = useState<RoomData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState<"ADMIN" | "MEMBER" | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "anggota">("anggota")
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
  })
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "TRANSFER",
    note: "",
  })

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const userResponse = await fetch("/api/auth/me")
        const userData = await userResponse.json()
        const currentUserId = userData?.userId ?? null
        const headers: Record<string, string> = {}
        if (currentUserId) {
          headers["x-user-id"] = String(currentUserId)
        }
        const response = await fetch(`/api/rooms/${roomId}`, {
          headers,
        })
        const result = await response.json()
        if (result.success) {
          setRoom(result.data)
          setCurrentUserRole(result.currentUserRole)
        }
      } catch (error) {
        console.error("Failed to fetch room:", error)
      } finally {
        setLoading(false)
      }
    }
    if (roomId) {
      fetchRoom()
    }
  }, [roomId])

  const isAdmin = currentUserRole === "ADMIN"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (!room) {
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

  const totalDues = room.dues.length
  const totalPaid = room.invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + i.amount, 0)
  const totalPending = room.invoices.filter((i) => i.status !== "PAID").reduce((sum, i) => sum + i.amount, 0)
  const recentActivities = room.invoices
    .sort((a, b) => new Date(b.paidDate || b.dueDate).getTime() - new Date(a.paidDate || a.dueDate).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "lunas":
        return "bg-green-100 text-green-700"
      case "PENDING":
      case "menunggu_konfirmasi":
        return "bg-yellow-100 text-yellow-700"
      case "DRAFT":
      case "belum_bayar":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return "Lunas"
      case "PENDING":
        return "Tertanggung"
      case "DRAFT":
        return "Draft"
      case "OVERDUE":
        return "Terlambat"
      default:
        return status
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return
    try {
      const response = await fetch(`/api/rooms/${roomId}/invoices/${selectedInvoice.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseInt(paymentForm.amount),
          method: paymentForm.method,
          note: paymentForm.note,
          createdById: 1,
        }),
      })
      if (response.ok) {
        const result = await response.json()
        const roomResponse = await fetch(`/api/rooms/${roomId}`)
        const roomResult = await roomResponse.json()
        setRoom(roomResult.data)
        setShowPaymentModal(false)
        setPaymentForm({ amount: "", method: "TRANSFER", note: "" })
      }
    } catch (error) {
      console.error("Failed to process payment:", error)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberForm.name || !newMemberForm.email) return
    try {
      const response = await fetch(`/api/rooms/${roomId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMemberForm.name,
          email: newMemberForm.email,
          role: "MEMBER",
        }),
      })
      if (response.ok) {
        const roomResponse = await fetch(`/api/rooms/${roomId}`)
        const roomResult = await roomResponse.json()
        setRoom(roomResult.data)
        setShowAddMemberModal(false)
        setNewMemberForm({ name: "", email: "" })
      }
    } catch (error) {
      console.error("Failed to add member:", error)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (confirm("Hapus anggota ini dari grup?")) {
      try {
        await fetch(`/api/rooms/${roomId}/members/${memberId}`, { method: "DELETE" })
        setRoom({
          ...room,
          members: room.members.filter((m) => m.id !== memberId),
        })
      } catch (error) {
        console.error("Failed to remove member:", error)
      }
    }
  }

  const handleChangeRole = async (memberId: number, newRole: "ADMIN" | "MEMBER") => {
    try {
      await fetch(`/api/rooms/${roomId}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      setRoom({
        ...room,
        members: room.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
      })
    } catch (error) {
      console.error("Failed to change role:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => router.back()}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Kembali
        </Button>
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 mb-6">
          <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{room.name}</h1>
                <p className="text-gray-600 mt-2">{room.description}</p>
              </div>
              {isAdmin && (
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 w-fit">
                  <Crown size={16} />
                  Admin
                </div>
              )}
            </div>
            {isAdmin && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-blue-500" />
                    <p className="text-xs text-gray-600">Total Iuran</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{totalDues}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-green-500" />
                    <p className="text-xs text-gray-600">Sudah Bayar</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">Rp {totalPaid.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-red-500" />
                    <p className="text-xs text-gray-600">Tertanggung</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">Rp {totalPending.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-purple-500" />
                    <p className="text-xs text-gray-600">Anggota</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{room.members.length}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("anggota")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "anggota" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Anggota
          </button>
          <button
            onClick={() => router.push(`/dashboard/grup/${roomId}/iuran`)}
            className="px-4 py-3 font-semibold transition-colors text-gray-600 hover:text-gray-900"
          >
            Iuran
          </button>
        </div>
        {activeTab === "anggota" && (
          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Anggota</h2>
                {isAdmin && (
                  <Button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Tambah Anggota
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{member.user.name}</p>
                        <p className="text-sm text-gray-600">{member.user.email}</p>
                      </div>
                      {member.role === "ADMIN" && (
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          <Crown size={12} className="inline mr-1" />
                          Admin
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 pt-3 border-t">
                        {member.role === "MEMBER" ? (
                          <Button
                            onClick={() => handleChangeRole(member.id, "ADMIN")}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-1"
                          >
                            <Crown size={14} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleChangeRole(member.id, "MEMBER")}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs py-1"
                          >
                            <Users size={14} />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRemoveMember(member.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
                <p className="text-gray-600 mb-6">{selectedInvoice.code}</p>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal (Rp)</label>
                    <Input
                      type="number"
                      placeholder={selectedInvoice.amount.toString()}
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Metode</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>TRANSFER</option>
                      <option>CASH</option>
                      <option>QRIS</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                      Bayar
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Anggota</h2>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
                    <Input
                      type="text"
                      placeholder="Nama anggota"
                      value={newMemberForm.name}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="Email anggota"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
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
      </div>
    </div>
  )
}
