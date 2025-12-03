import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Due, Invoice, getStatusColor, getStatusIcon, getStatusLabel } from "./shared"

interface MemberDetailProps {
  due: Due
  roomId: string
  currentUserId: number | null // <--- UBAH INI (Pakai User ID)
  onPay: (invoice: Invoice) => void
}

export function MemberDetail({ due, roomId, currentUserId, onPay }: MemberDetailProps) {
  // --- LOGIKA FILTER DIPERBAIKI ---
  // Bandingkan invoice.memberId (yang isinya User ID) dengan currentUserId
  const myInvoices = due.invoices.filter((invoice) => {
    return currentUserId && Number(invoice.memberId) === Number(currentUserId)
  })

  return (
    <div className="space-y-6 mt-6">
      <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Tagihan Saya</h2>

          {/* Cek apakah ada invoice untuk user ini */}
          {myInvoices.length > 0 ? (
            myInvoices.map((invoice) => {
              return (
                <div key={invoice.id} className="space-y-6 border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
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
                        <p className="text-lg font-bold text-gray-900 font-mono">{due.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Salin nomor rekening untuk transfer</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Tanggal Bayar */}
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

                  {/* Catatan Tambahan */}
                  {invoice.description && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-xs text-gray-600 mb-1">Catatan</p>
                      <p className="text-gray-900">{invoice.description}</p>
                    </div>
                  )}

                  {/* Tombol Aksi */}
                  <div className="flex gap-3">
                    {invoice.status === "DRAFT" || invoice.status === "OVERDUE" ? (
                      <Button
                        onClick={() => onPay(invoice)}
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
            })
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Tidak Ada Tagihan</h3>
              <p className="text-gray-600 mt-1">
                {currentUserId 
                  ? "Anda tidak memiliki tagihan aktif pada iuran ini." 
                  : "Sedang memuat data user..."}
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* ... Info Grup Card (Tetap Sama) ... */}
      <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Grup</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Nama Grup</span>
              <span className="font-semibold text-gray-900">{roomId}</span>
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
  )
}