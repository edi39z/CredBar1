import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Loader2, CheckCircle, ExternalLink, Calendar, CreditCard, AlignLeft, Check } from "lucide-react"
import { Invoice, RoomMember } from "./shared"

// =========================================================
// 1. PAYMENT MODAL (Upload Bukti & Bayar)
// =========================================================
export function PaymentModal({
  show,
  onClose,
  selectedInvoice,
  dueName,
  paymentForm,
  setPaymentForm,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  selectedInvoice: Invoice | null
  dueName: string
  paymentForm: any
  setPaymentForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (Maks 5MB)")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (response.ok && data.url) {
        setPaymentForm({ ...paymentForm, proofFile: data.url })
      } else {
        alert("Gagal mengupload gambar: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Terjadi kesalahan saat upload gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!show || !selectedInvoice) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
          <p className="text-gray-600 mb-6">{dueName}</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Total yang harus dibayar</p>
              <p className="text-3xl font-bold text-blue-700">
                Rp {Number(selectedInvoice.amount).toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-blue-500 mt-1">*Pembayaran harus full</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                placeholder="Contoh: Sudah transfer ke BCA"
                value={paymentForm.note}
                onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bukti Pembayaran (Opsional)</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

              {!paymentForm.proofFile ? (
                <div onClick={triggerFileInput} className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                      <span className="text-gray-500">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-gray-600">Klik untuk Upload Bukti</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={paymentForm.proofFile} alt="Bukti" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Upload Berhasil</p>
                      <a href={paymentForm.proofFile} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">Lihat Gambar</a>
                    </div>
                    <button type="button" onClick={() => setPaymentForm({...paymentForm, proofFile: ""})} className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"><X size={18} /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900">Batal</Button>
              <Button type="submit" disabled={isUploading} className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50">{isUploading ? "Tunggu..." : "Bayar Sekarang"}</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

// =========================================================
// 2. PAYMENT DETAIL MODAL (Admin View: Lihat Bukti & Konfirmasi)
// =========================================================
export function PaymentDetailModal({
  show,
  onClose,
  data,
  onConfirm,
}: {
  show: boolean
  onClose: () => void
  data: {
    userName: string
    amount: number | string
    status: string
    date?: string
    note?: string
    proofUrl?: string | null
    method?: string
    invoiceId: string
  } | null
  onConfirm: (id: string) => void
}) {
  if (!show || !data) return null

  const isPending = data.status === "PENDING"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row bg-white border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* KOLOM KIRI: GAMBAR */}
        <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center relative min-h-[300px] md:min-h-full">
          {data.proofUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.proofUrl} alt="Bukti Pembayaran" className="max-w-full max-h-[50vh] md:max-h-full object-contain" />
              <a href={data.proofUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                <ExternalLink size={12} /> Buka Original
              </a>
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <span className="text-4xl mb-2">📷</span>
              <p className="text-sm">Tidak ada bukti gambar</p>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: DETAIL */}
        <div className="w-full md:w-1/2 p-6 flex flex-col relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{data.userName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                data.status === "PAID" ? "bg-green-100 text-green-700" : 
                data.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
              }`}>
                {data.status === "PAID" ? "Lunas" : data.status === "PENDING" ? "Menunggu Konfirmasi" : "Belum Bayar"}
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="font-semibold text-lg text-blue-600">Rp {Number(data.amount).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Tanggal Bayar</p>
                <p className="text-gray-700">{data.date || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Metode</p>
                <p className="text-gray-700">{data.method || "Transfer"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlignLeft className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Catatan</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1 text-sm border border-gray-100">{data.note || "Tidak ada catatan"}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t">
            {isPending ? (
              <Button onClick={() => onConfirm(data.invoiceId)} className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base shadow-md">
                <Check className="mr-2 h-5 w-5" /> Konfirmasi Pembayaran
              </Button>
            ) : (
              <div className="text-center text-gray-400 text-sm">Data transaksi ini sudah selesai.</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// =========================================================
// 3. INVITE MODAL
// =========================================================
export function InviteModal({
  show,
  onClose,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Info</h2>
          <p className="text-gray-600 mb-6">Fitur ini telah dipindahkan.</p>
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Tutup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// =========================================================
// 4. MESSAGE MODAL
// =========================================================
export function MessageModal({
  show,
  onClose,
  selectedInvoice,
  messageForm,
  setMessageForm,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  selectedInvoice: Invoice | null
  messageForm: any
  setMessageForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!show || !selectedInvoice) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
          <p className="text-gray-600 mb-6">Ke: {selectedInvoice.member?.name || "Unknown Member"}</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
              <textarea
                placeholder="Tulis pesan pengingat..."
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
                onClick={onClose}
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
  )
}

// =========================================================
// 5. EDIT IURAN MODAL
// =========================================================
export function EditModal({
  show,
  onClose,
  editForm,
  setEditForm,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  editForm: any
  setEditForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Iuran</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Total (Rp)</label>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                onClick={onClose}
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
  )
}

// =========================================================
// 6. DELEGATE MODAL
// =========================================================
export function DelegateModal({
  show,
  onClose,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  onSubmit: () => void
}) {
  if (!show) return null
  return null 
}

// =========================================================
// 7. ADD MEMBER MODAL
// =========================================================
export function AddMemberModal({
  show,
  onClose,
  groupMembers,
  selectedMemberId,
  setSelectedMemberId,
  amount,
  setAmount,
  isAddingMember,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  groupMembers: RoomMember[]
  selectedMemberId: string
  setSelectedMemberId: (id: string) => void
  amount: string
  setAmount: (val: string) => void
  isAddingMember: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tambah Anggota Iuran</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {groupMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Tidak ada anggota grup yang tersedia</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Anggota dari Grup</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMemberId === String(member.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMemberId(String(member.id))}
                    >
                      <p className="font-semibold text-gray-900">{member.user.name}</p>
                      <p className="text-xs text-gray-600">{member.user.email}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* INPUT NOMINAL MANUAL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Tagihan (Rp)</label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah tagihan"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Nominal ini akan ditagihkan ke anggota yang dipilih.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedMemberId || !amount || isAddingMember}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                >
                  {isAddingMember ? "Menambahkan..." : "Tambah Anggota"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}

// =========================================================
// 8. EDIT INVOICE AMOUNT MODAL
// =========================================================
export function EditInvoiceAmountModal({
  show,
  onClose,
  amount,
  setAmount,
  onSubmit,
}: {
  show: boolean
  onClose: () => void
  amount: string
  setAmount: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ubah Nominal Tagihan</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Baru (Rp)</label>
              <Input
                type="number"
                placeholder="Masukkan nominal baru"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}