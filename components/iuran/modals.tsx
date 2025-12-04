import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import { Invoice, RoomMember } from "./shared"

// --- Payment Modal (FIXED: Tampilan Nominal Read-Only) ---
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
  if (!show || !selectedInvoice) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Iuran</h2>
          <p className="text-gray-600 mb-6">{dueName}</p>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* TAMPILAN NOMINAL (READ ONLY) */}
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Total yang harus dibayar</p>
              <p className="text-3xl font-bold text-blue-700">
                Rp {Number(selectedInvoice.amount).toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-blue-500 mt-1">*Pembayaran harus full (tidak bisa dicicil)</p>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bukti Pembayaran (Opsional)</label>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload size={20} className="text-gray-500" />
                <span className="text-gray-600">Upload Bukti</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
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
  )
}

// --- Invite Modal (Tetap ada untuk kompatibilitas import) ---
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

// --- Message Modal ---
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

// --- Edit Iuran Modal ---
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

// --- Delegate Modal (Tetap ada untuk kompatibilitas import) ---
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
  return null // Render nothing jika dipanggil
}

// --- Add Member Modal (UPDATED: Ada input nominal) ---
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

// --- NEW: Edit Invoice Amount Modal ---
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