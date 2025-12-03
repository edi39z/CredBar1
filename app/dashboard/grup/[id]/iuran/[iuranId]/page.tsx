"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

interface Invoice {
  id: string
  code: string
  memberId: string
  dueId?: number
  description?: string
  amount: number
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE"
  dueDate: string
  paidDate?: string
  paymentMethod?: string
  member?: {
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

interface Due {
  id: number
  name: string
  description?: string
  amount: number
  isRecurring: boolean
  frequency?: string
  interval?: number
  startDate?: string
  nextDueDate?: string
  isActive: boolean
  invoices: Invoice[]
}

export default function IuranDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const iuranId = params.iuranId as string

  const [due, setDue] = useState<Due | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "TRANSFER",
    note: "",
  })

  const [messageForm, setMessageForm] = useState({ message: "" }) // Declared messageForm

  const refetchDue = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/rooms/${roomId}/dues`)
      const result = await response.json()
      if (result.success) {
        const dues = result.data as Due[]
        const foundDue = dues.find((d) => d.id === Number.parseInt(iuranId))
        if (foundDue) {
          setDue(foundDue)
        }
      }
    } catch (error) {
      console.error("Error fetching due:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (roomId && iuranId) {
      refetchDue()
    }
  }, [roomId, iuranId])

  // Find the iuran and grup (This section is no longer relevant with API fetch)
  // let iuran: Iuran | null = null
  // let grup: Grup | null = null

  // for (const g of allGroups) {
  //   const found = g.iurans.find((i) => i.id === iuranId)
  //   if (found) {
  //     iuran = found
  //     grup = g
  //     break
  //   }
  // }

  // const [currentIuran, setCurrentIuran] = useState<Iuran | null>(iuran)
  // const [currentGrup, setCurrentGrup] = useState<Grup | null>(grup)

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDelegateModal, setShowDelegateModal] = useState(false) // Added state for delegate modal
  // const [selectedMember, setSelectedMember] = useState<IuranMember | null>(null) // Replaced by selectedInvoice

  // State for edit form, now using Due interface
  const [editForm, setEditForm] = useState({
    name: due?.name || "",
    description: due?.description || "",
    amount: due?.amount.toString() || "",
    frequency: due?.frequency || "",
    interval: due?.interval?.toString() || "",
    startDate: due?.startDate || "",
    nextDueDate: due?.nextDueDate || "",
  })

  // Update edit form state when due data is fetched
  useEffect(() => {
    if (due) {
      setEditForm({
        name: due.name || "",
        description: due.description || "",
        amount: due.amount.toString() || "",
        frequency: due.frequency || "",
        interval: due.interval?.toString() || "",
        startDate: due.startDate || "",
        nextDueDate: due.nextDueDate || "",
      })
    }
  }, [due])

  const isAdmin = false // This needs to be determined from user session or group roles in a real app

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!due) {
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

  // Calculate totals based on fetched due data
  const totalTerkumpul = due.invoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0)
  const totalBelumBayar = due.invoices.filter((inv) => inv.status !== "PAID").reduce((sum, inv) => sum + inv.amount, 0)
  const lunas = due.invoices.filter((inv) => inv.status === "PAID").length
  const menunggu = due.invoices.filter((inv) => inv.status === "PENDING").length
  const belumBayar = due.invoices.filter((inv) => inv.status === "OVERDUE" || inv.status === "DRAFT").length
  const progress = due.invoices.length > 0 ? (lunas / due.invoices.length) * 100 : 0

  // Placeholder functions for actions (need actual API calls)
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice || !due) return

    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(paymentForm.amount),
          method: paymentForm.method,
          note: paymentForm.note,
        }),
      })
      const result = await response.json()
      if (result.success) {
        alert("Pembayaran berhasil dikirim!")
        await refetchDue()
        setShowPaymentModal(false)
        setPaymentForm({ amount: "", method: "TRANSFER", note: "" })
      } else {
        alert(`Pembayaran gagal: ${result.message}`)
      }
    } catch (error) {
      console.error("Error submitting payment:", error)
      alert("Terjadi kesalahan saat memproses pembayaran.")
    }
  }

  const handleConfirmPayment = async (invoiceId: string) => {
    if (!due) return

    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}/invoices/${invoiceId}/confirm`, {
        method: "POST",
      })
      const result = await response.json()
      if (result.success) {
        alert("Pembayaran berhasil dikonfirmasi!")
        await refetchDue()
      } else {
        alert(`Konfirmasi pembayaran gagal: ${result.message}`)
      }
    } catch (error) {
      console.error("Error confirming payment:", error)
      alert("Terjadi kesalahan saat mengkonfirmasi pembayaran.")
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    // This logic needs to be adapted to create new invoices for members
    // For now, it's a placeholder and might not be directly applicable to the new model
    alert("Fungsi 'Tambah Anggota' perlu diadaptasi ke model Invoice/Due.")
    setShowInviteModal(false)
    // setInviteForm({ memberId: "" })
  }

  const handleEditIuran = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!due) return

    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          amount: Number.parseFloat(editForm.amount),
          frequency: editForm.frequency,
          interval: Number.parseInt(editForm.interval),
          startDate: editForm.startDate,
          nextDueDate: editForm.nextDueDate,
        }),
      })
      const result = await response.json()
      if (result.success) {
        alert("Iuran berhasil diperbarui!")
        await refetchDue()
        setShowEditModal(false)
      } else {
        alert(`Pembaruan iuran gagal: ${result.message}`)
      }
    } catch (error) {
      console.error("Error updating due:", error)
      alert("Terjadi kesalahan saat memperbarui iuran.")
    }
  }

  const handleDelegateAdmin = async () => {
    // This function is specific to the old model and not directly applicable here.
    // In a real app, role management would likely be handled differently.
    alert("Fungsi 'Delegasi Admin' tidak relevan dengan model data ini.")
  }

  const handleDeleteIuran = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus iuran ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}`, {
          method: "DELETE",
        })
        const result = await response.json()
        if (result.success) {
          alert("Iuran berhasil dihapus!")
          router.back()
        } else {
          alert(`Penghapusan iuran gagal: ${result.message}`)
        }
      } catch (error) {
        console.error("Error deleting due:", error)
        alert("Terjadi kesalahan saat menghapus iuran.")
      }
    }
  }

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "OVERDUE":
      case "DRAFT":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return "Lunas"
      case "PENDING":
        return "Menunggu Konfirmasi"
      case "OVERDUE":
        return "Terlambat"
      case "DRAFT":
        return "Draft"
      default:
        return status
    }
  }

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return <CheckCircle size={16} />
      case "PENDING":
        return <Clock size={16} />
      case "OVERDUE":
        return <AlertCircle size={16} />
      case "DRAFT":
        return <Edit2 size={16} />
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{due.name}</h1>
                <p className="text-gray-600 mt-2">{due.description}</p>
                <p className="text-sm text-gray-500 mt-2">Grup: {roomId}</p> {/* Placeholder for room name */}
              </div>
              <div className="flex gap-2 flex-wrap">
                {isAdmin && ( // This should check if the current user is an admin of the room/group
                  <>
                    <Button
                      onClick={() => {
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
                      onClick={handleDelegateAdmin} // This function is likely not applicable
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
                <p className="font-bold text-gray-900 text-lg">Rp {due.amount.toLocaleString("id-ID")}</p>
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
                <p className="font-bold text-gray-900 text-lg">{due.invoices.length}</p>
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
                    {lunas} dari {due.invoices.length} anggota telah membayar
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
                      {due.invoices
                        .filter((inv) => inv.status === "PAID")
                        .reduce((sum, inv) => sum + inv.amount, 0)
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
                      {due.invoices
                        .filter((inv) => inv.status === "PENDING")
                        .reduce((sum, inv) => sum + inv.amount, 0)
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
                      {due.invoices
                        .filter((inv) => inv.status === "OVERDUE" || inv.status === "DRAFT")
                        .reduce((sum, inv) => sum + inv.amount, 0)
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
                  <p className="text-xs text-gray-600 mb-1">Nomor Rekening / QR</p>
                  <p className="font-bold text-gray-900 text-sm break-all">{due.description}</p>{" "}
                  {/* Assuming description holds this */}
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Jatuh Tempo</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(due.nextDueDate!).toLocaleDateString("id-ID", {
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
                    {new Date(due.startDate!).toLocaleDateString("id-ID")} {/* Assuming startDate is creation date */}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Members List (Invoices List) */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Daftar Tagihan</h2>
              <div className="flex gap-2">
                {isAdmin && ( // Add functionality to create new invoices/members
                  <>
                    <Button
                      onClick={() => setShowInviteModal(true)} // This might need to be 'Add Invoice'
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Tambah Tagihan
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {due.invoices.map((invoice) => {
                const memberName = invoice.member?.name || "Unknown Member" // Use member name from invoice
                const memberNominal = invoice.amount
                const memberStatus = invoice.status

                return (
                  <div key={invoice.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{memberName}</p>
                        <p className="text-sm text-gray-600">Rp {memberNominal.toLocaleString("id-ID")}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(memberStatus)}`}
                      >
                        {getStatusIcon(memberStatus)}
                        {getStatusLabel(memberStatus)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            memberStatus === "PAID"
                              ? "bg-green-500"
                              : memberStatus === "PENDING"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: memberStatus === "PAID" ? "100%" : "0%" }}
                        />
                      </div>
                    </div>

                    {invoice.paidDate && (
                      <p className="text-xs text-gray-600 mb-2">
                        Bayar: {new Date(invoice.paidDate).toLocaleDateString("id-ID")}
                      </p>
                    )}

                    {invoice.description && (
                      <p className="text-xs text-gray-600 mb-2 italic">Catatan: {invoice.description}</p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {memberStatus === "DRAFT" || memberStatus === "OVERDUE" ? (
                        <Button
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowPaymentModal(true)
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3"
                        >
                          Bayar
                        </Button>
                      ) : memberStatus === "PENDING" ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                          <p className="text-yellow-700 font-semibold text-xs">Menunggu Konfirmasi</p>
                        </div>
                      ) : memberStatus === "PAID" ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                          <p className="text-green-700 font-semibold text-xs flex items-center gap-1">
                            <CheckCircle size={14} />
                            Lunas
                          </p>
                        </div>
                      ) : null}

                      {isAdmin && memberStatus === "PENDING" && (
                        <Button
                          onClick={() => handleConfirmPayment(invoice.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3"
                        >
                          Konfirmasi
                        </Button>
                      )}
                      {isAdmin && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setShowMessageModal(true)
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 px-3"
                          >
                            <Send size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Member view section for non-admin users (Invoices for the logged-in user) */}
        {/* Assuming a way to identify the current user's invoices */}
        {/* For demonstration, let's assume we want to show the invoices for a specific member if not admin */}
        {!isAdmin && (
          <div className="space-y-6 mt-6">
            {/* Member Payment Detail Card */}
            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Tagihan Saya</h2>

                {/* This section needs to be filtered for the current logged-in user's invoices */}
                {/* For now, showing the first invoice as an example */}
                {due.invoices.length > 0 ? (
                  due.invoices.map((invoice) => {
                    // Assuming 'm2' is the ID of the current logged-in user (this needs to be dynamic)
                    if (invoice.memberId === "m2") {
                      // Replace "m2" with actual current user ID
                      return (
                        <div key={invoice.id} className="space-y-6">
                          {/* Status Card */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
                                <h3 className="text-2xl font-bold text-gray-900">{due.name}</h3>
                              </div>
                              <span
                                className={`text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(invoice.status)}`}
                              >
                                {getStatusIcon(invoice.status)}
                                {getStatusLabel(invoice.status)}
                              </span>
                            </div>
                            <p className="text-gray-600">{invoice.description || due.description}</p>
                          </div>

                          {/* Payment Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="text-xs text-gray-600 mb-1">Nominal Tagihan</p>
                              <p className="text-2xl font-bold text-blue-600">
                                Rp {invoice.amount.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <p className="text-xs text-gray-600 mb-1">Jatuh Tempo</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {new Date(invoice.dueDate).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Payment Method Card */}
                          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">Nomor Rekening / QR</p>
                                <p className="text-lg font-bold text-gray-900 font-mono">{due.description}</p>{" "}
                                {/* Assuming description holds payment details */}
                                <p className="text-xs text-gray-500 mt-2">Salin nomor rekening untuk transfer</p>
                              </div>
                            </div>
                          </div>

                          {invoice.paidDate && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="text-xs text-gray-600 mb-1">Tanggal Pembayaran</p>
                              <p className="text-lg font-bold text-green-600">
                                {new Date(invoice.paidDate).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          )}

                          {invoice.description && (
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                              <p className="text-xs text-gray-600 mb-1">Catatan</p>
                              <p className="text-gray-900">{invoice.description}</p>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="flex gap-3">
                            {invoice.status === "DRAFT" || invoice.status === "OVERDUE" ? (
                              <Button
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setShowPaymentModal(true)
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
                              >
                                Bayar Sekarang
                              </Button>
                            ) : invoice.status === "PENDING" ? (
                              <div className="flex-1 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
                                <p className="text-yellow-700 font-semibold">Menunggu Konfirmasi Admin</p>
                                <p className="text-xs text-yellow-600 mt-1">Pembayaran Anda sedang diverifikasi</p>
                              </div>
                            ) : invoice.status === "PAID" ? (
                              <div className="flex-1 bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                                <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                                  <CheckCircle size={20} />
                                  Sudah Lunas
                                </p>
                                <p className="text-xs text-green-600 mt-1">Terima kasih atas pembayaran Anda</p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    }
                    return null // Render nothing for other invoices
                  })
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Anda belum terdaftar dalam iuran ini</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Grup</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Nama Grup</span>
                    <span className="font-semibold text-gray-900">{roomId}</span> {/* Placeholder for room name */}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Anggota</span>
                    <span className="font-semibold text-gray-900">{due.invoices.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Iuran</span>
                    <span className="font-semibold text-gray-900">Rp {due.amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
                <p className="text-gray-600 mb-6">{selectedInvoice.description || due.name}</p>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Pembayaran (Rp)</label>
                    <Input
                      type="number"
                      placeholder={selectedInvoice.amount.toString()}
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TRANSFER">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="CASH">Tunai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
                    <Input
                      type="text"
                      placeholder="Contoh: Sudah transfer"
                      value={paymentForm.note}
                      onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
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
                        setPaymentForm({ amount: "", method: "TRANSFER", note: "" })
                        setSelectedInvoice(null)
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

        {/* Invite Member Modal (Potentially for creating new invoices) */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tambah Tagihan Baru</h2>
                <p className="text-gray-600 mb-6">Masukkan detail tagihan baru</p>

                <form onSubmit={handleInviteMember} className="space-y-4">
                  {" "}
                  {/* Re-purpose this form */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Anggota / ID</label>
                    <Input
                      type="text"
                      placeholder="Nama atau ID Anggota"
                      // value={inviteForm.memberId} // Need to adapt form state
                      // onChange={(e) => setInviteForm({ ...inviteForm, memberId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Tagihan (Rp)</label>
                    <Input
                      type="number"
                      placeholder="Jumlah tagihan"
                      // value={inviteForm.amount} // Need to adapt form state
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jatuh Tempo</label>
                    <Input
                      type="date"
                      // value={inviteForm.dueDate} // Need to adapt form state
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowInviteModal(false)
                        // reset form state
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                      Buat Tagihan
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
                <p className="text-gray-600 mb-6">Ke: {selectedInvoice.member?.name || "Unknown Member"}</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    // Actual message sending logic would go here
                    alert(`Pesan terkirim ke ${selectedInvoice.member?.name || "Unknown Member"}`)
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
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                    <Input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Total (Rp)</label>
                    <Input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Frekuensi</label>
                    <select
                      value={editForm.frequency}
                      onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Frekuensi</option>
                      <option value="DAILY">Harian</option>
                      <option value="WEEKLY">Mingguan</option>
                      <option value="MONTHLY">Bulanan</option>
                      <option value="YEARLY">Tahunan</option>
                    </select>
                  </div>

                  {editForm.frequency && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Interval</label>
                      <Input
                        type="number"
                        placeholder="Contoh: 1 (untuk setiap bulan)"
                        value={editForm.interval}
                        onChange={(e) => setEditForm({ ...editForm, interval: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai</label>
                    <Input
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Jatuh Tempo Berikutnya
                    </label>
                    <Input
                      type="date"
                      value={editForm.nextDueDate}
                      onChange={(e) => setEditForm({ ...editForm, nextDueDate: e.target.value })}
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
                      // value={delegateForm.memberId} // Need to adapt form state
                      // onChange={(e) => setDelegateForm({ memberId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Anggota --</option>
                      {/* Filter and map members here, similar to the old version */}
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
                        // reset delegate form
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
