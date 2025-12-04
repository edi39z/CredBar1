"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Import components
import { Due, Invoice, RoomMember } from "@/components/iuran/shared"
import { HeaderCard } from "@/components/iuran/header-card"
import { ProgressCard } from "@/components/iuran/progress-card"
import { InfoCard } from "@/components/iuran/info-card"
import { InvoiceList } from "@/components/iuran/invoice-list"
import { MemberDetail } from "@/components/iuran/member-detail"
import {
  PaymentModal,
  InviteModal,
  MessageModal,
  EditModal,
  DelegateModal,
  AddMemberModal,
  EditInvoiceAmountModal,
} from "@/components/iuran/modals"

export default function IuranDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const iuranId = params.iuranId as string

  const [due, setDue] = useState<Due | null>(null)
  const [loading, setLoading] = useState(true)
  
  // State User & Member
  const [userRole, setUserRole] = useState<"admin" | "member">("member")
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null)

  // State UI
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  // State Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "TRANSFER",
    note: "",
  })

  const [messageForm, setMessageForm] = useState({ message: "" })
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [groupMembers, setGroupMembers] = useState<RoomMember[]>([])
  
  // State untuk Add Member & Nominal Manual
  const [selectedMemberId, setSelectedMemberId] = useState<string>("")
  const [addMemberAmount, setAddMemberAmount] = useState<string>("") 
  const [isAddingMember, setIsAddingMember] = useState(false)

  // State untuk Edit Nominal Tagihan (Admin)
  const [showEditAmountModal, setShowEditAmountModal] = useState(false)
  const [editInvoiceAmount, setEditInvoiceAmount] = useState("")
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  // State modals lain
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDelegateModal, setShowDelegateModal] = useState(false)

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    amount: "",
    frequency: "",
    interval: "",
    startDate: "",
    nextDueDate: "",
  })

  // --- FETCHING LOGIC ---
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

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`)
      const result = await response.json()

      if (result.success) {
        const roleFromApi = (result.currentUserRole || "").toLowerCase()
        const role = roleFromApi === "admin" ? "admin" : "member"
        setUserRole(role)
        
        if (result.currentUserId) {
            setCurrentUserId(result.currentUserId)
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error)
    }
  }

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/members`)
      const result = await response.json()
      if (result.success) {
        setGroupMembers(result.data)
      }
    } catch (error) {
      console.error("Error fetching group members:", error)
    }
  }

  useEffect(() => {
    if (roomId && iuranId) {
      refetchDue()
      fetchUserRole()
      fetchGroupMembers()
    }
  }, [roomId, iuranId])

  useEffect(() => {
    if (currentUserId && groupMembers.length > 0) {
        const myMember = groupMembers.find(m => m.userId === currentUserId)
        if (myMember) {
            setCurrentMemberId(String(myMember.id))
        }
    }
  }, [currentUserId, groupMembers])

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

  const isAdmin = userRole === "admin"

  const calculateStats = () => {
    if (!due) return { totalTerkumpul: 0, totalBelumBayar: 0, lunas: 0, menunggu: 0, belumBayar: 0, progress: 0, totalTagihanDialokasikan: 0 }

    const invoices = due.invoices || []
    
    const totalTagihanDialokasikan = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)

    const totalTerkumpul = invoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + Number(inv.amount), 0)

    const totalBelumBayar = invoices
      .filter((inv) => inv.status !== "PAID")
      .reduce((sum, inv) => sum + Number(inv.amount), 0)

    const lunas = invoices.filter((inv) => inv.status === "PAID").length
    const menunggu = invoices.filter((inv) => inv.status === "PENDING").length
    const belumBayar = invoices.filter((inv) => inv.status === "OVERDUE" || inv.status === "DRAFT").length
    
    const progress = invoices.length > 0 ? (lunas / invoices.length) * 100 : 0

    return { totalTerkumpul, totalBelumBayar, lunas, menunggu, belumBayar, progress, totalTagihanDialokasikan }
  }

  const stats = calculateStats()

  // --- HANDLERS ---
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMemberId) {
      alert("Pilih anggota terlebih dahulu")
      return
    }
    
    const nominalBaru = Number(addMemberAmount)
    
    if (!addMemberAmount || nominalBaru <= 0) {
      alert("Masukkan nominal tagihan yang valid")
      return
    }

    if (due) {
        const targetIuran = Number(due.amount)
        const sisaTarget = targetIuran - stats.totalTagihanDialokasikan

        if (nominalBaru > sisaTarget) {
            alert(`Gagal! Total tagihan melebihi target iuran.\n\nTarget: Rp ${targetIuran.toLocaleString()}\nSisa Kuota: Rp ${sisaTarget.toLocaleString()}`)
            return
        }
    }

    setIsAddingMember(true)
    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            memberId: Number(selectedMemberId),
            amount: nominalBaru
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Tagihan anggota berhasil ditambahkan")
        await refetchDue()
        setShowAddMemberModal(false)
        setSelectedMemberId("")
        setAddMemberAmount("") 
      } else {
        alert(result.message || "Gagal menambahkan anggota")
      }
    } catch (error) {
      console.error("Error adding member:", error)
      alert("Terjadi kesalahan saat menambahkan anggota")
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleUpdateInvoiceAmount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoiceId || !editInvoiceAmount) return

    const nominalBaru = Number(editInvoiceAmount)

    if (due) {
        const oldInvoice = due.invoices.find(inv => inv.id === selectedInvoiceId)
        const oldAmount = oldInvoice ? Number(oldInvoice.amount) : 0
        
        const targetIuran = Number(due.amount)
        const totalTanpaInvoiceIni = stats.totalTagihanDialokasikan - oldAmount
        
        if ((totalTanpaInvoiceIni + nominalBaru) > targetIuran) {
             alert(`Gagal! Total tagihan melebihi target iuran Rp ${targetIuran.toLocaleString()}`)
             return
        }
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}/invoices/${selectedInvoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: nominalBaru }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Nominal tagihan berhasil diperbarui")
        await refetchDue() 
        setShowEditAmountModal(false)
        setEditInvoiceAmount("")
        setSelectedInvoiceId(null)
      } else {
        alert(result.message || "Gagal memperbarui tagihan")
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
      alert("Terjadi kesalahan saat memperbarui tagihan")
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice || !due) return

    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(selectedInvoice.amount),
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
    if (!isAdmin) {
      alert("Hanya admin yang dapat mengkonfirmasi pembayaran")
      return
    }
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
    alert("Gunakan tombol 'Tambah Anggota' di atas untuk menambah tagihan.")
    setShowInviteModal(false)
  }

  const handleEditIuran = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!due) return
    try {
      const response = await fetch(`/api/rooms/${roomId}/dues/${iuranId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // --- RENDER ---
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

        {/* PERBAIKAN DI SINI: MENGHAPUS roomId */}
        <HeaderCard
          due={due}
          isAdmin={isAdmin}
          totalTerkumpul={stats.totalTerkumpul}
          totalBelumBayar={stats.totalBelumBayar}
          onAddMember={() => setShowAddMemberModal(true)}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDeleteIuran}
          onDelegate={() => { } } groupName={""}        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ProgressCard
            progress={stats.progress}
            lunas={stats.lunas}
            menunggu={stats.menunggu}
            belumBayar={stats.belumBayar}
            due={due}
          />
          <InfoCard due={due} />
        </div>

        {isAdmin && (
          <InvoiceList
            due={due}
            isAdmin={isAdmin}
            currentMemberId={String(currentUserId)}
            onOpenInviteModal={() => {}} 
            onPay={(inv) => {
              setSelectedInvoice(inv)
              setShowPaymentModal(true)
            }}
            onConfirm={handleConfirmPayment}
            onSendMessage={(inv) => {
              setSelectedInvoice(inv)
              setShowMessageModal(true)
            }}
            onEditAmount={(inv) => {
              setSelectedInvoiceId(inv.id)
              setEditInvoiceAmount(inv.amount.toString())
              setShowEditAmountModal(true)
            }}
          />
        )}

        {!isAdmin && (
          <MemberDetail
            due={due}
            roomId={roomId}
            currentUserId={currentUserId}
            onPay={(inv) => {
              setSelectedInvoice(inv)
              setShowPaymentModal(true)
            }}
          />
        )}

        {/* MODALS */}
        <PaymentModal
          show={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setPaymentForm({ amount: "", method: "TRANSFER", note: "" })
            setSelectedInvoice(null)
          }}
          selectedInvoice={selectedInvoice}
          dueName={due.name}
          paymentForm={paymentForm}
          setPaymentForm={setPaymentForm}
          onSubmit={handlePayment}
        />

        <InviteModal
          show={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
        />

        <MessageModal
          show={showMessageModal}
          onClose={() => {
            setShowMessageModal(false)
            setMessageForm({ message: "" })
          }}
          selectedInvoice={selectedInvoice}
          messageForm={messageForm}
          setMessageForm={setMessageForm}
          onSubmit={(e) => {
            e.preventDefault()
            alert(`Pesan terkirim ke ${selectedInvoice?.member?.name || "Unknown Member"}`)
            setShowMessageModal(false)
            setMessageForm({ message: "" })
          }}
        />

        <EditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          editForm={editForm}
          setEditForm={setEditForm}
          onSubmit={handleEditIuran}
        />

        <DelegateModal
          show={showDelegateModal}
          onClose={() => setShowDelegateModal(false)}
          onSubmit={handleDelegateAdmin}
        />

        <AddMemberModal
          show={showAddMemberModal}
          onClose={() => {
            setShowAddMemberModal(false)
            setAddMemberAmount("")
            setSelectedMemberId("")
          }}
          groupMembers={groupMembers}
          selectedMemberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}
          amount={addMemberAmount}
          setAmount={setAddMemberAmount}
          isAddingMember={isAddingMember}
          onSubmit={handleAddMember}
        />

        <EditInvoiceAmountModal
          show={showEditAmountModal}
          onClose={() => setShowEditAmountModal(false)}
          amount={editInvoiceAmount}
          setAmount={setEditInvoiceAmount}
          onSubmit={handleUpdateInvoiceAmount}
        />
      </div>
    </div>
  )
}