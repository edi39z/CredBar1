import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, MessageCircle, MoreHorizontal, Eye, ImageIcon } from "lucide-react"
import { Invoice, Due } from "./shared"
import { PaymentDetailModal } from "./modals"

interface InvoiceListProps {
  due: Due
  isAdmin: boolean
  currentMemberId: string | null
  onOpenInviteModal: () => void
  onPay: (invoice: Invoice) => void
  onConfirm: (id: string) => void
  onSendMessage: (invoice: Invoice) => void
  onEditAmount: (invoice: Invoice) => void
}

export function InvoiceList({
  due,
  isAdmin,
  currentMemberId,
  onOpenInviteModal,
  onPay,
  onConfirm,
  onSendMessage,
  onEditAmount,
}: InvoiceListProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<any>(null)

  const handleOpenDetail = (inv: Invoice, payment: any) => {
    setSelectedDetail({
      invoiceId: inv.id,
      userName: inv.member?.name || "Anggota",
      amount: inv.amount,
      status: inv.status,
      date: payment ? new Date(payment.paidAt || payment.createdAt).toLocaleDateString("id-ID", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : "-",
      note: payment?.note || "-",
      proofUrl: payment?.proofFile || null,
      method: payment?.method || "-"
    })
    setShowDetailModal(true)
  }

  const handleConfirmFromModal = (id: string) => {
    onConfirm(id)
    setShowDetailModal(false)
  }

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg border-0 mb-6 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Tagihan Anggota</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-4">Nama Anggota</th>
                  <th className="py-3 px-4">Info Pembayaran</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {due.invoices?.map((inv) => {
                  const latestPayment = inv.payments && inv.payments.length > 0 ? inv.payments[0] : null
                  // PERBAIKAN DISINI: Menambahkan (latestPayment as any)
                  const hasProof = (latestPayment as any)?.proofFile

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      {/* NAMA */}
                      <td className="py-3 px-4 align-top">
                        <p className="font-semibold text-gray-900">{inv.member?.name}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          Rp {Number(inv.amount).toLocaleString("id-ID")}
                        </p>
                      </td>

                      {/* INFO BAYAR */}
                      <td className="py-3 px-4 align-top">
                        {latestPayment ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-700">
                              <span className="font-semibold text-gray-500">Bayar:</span>{" "}
                              {new Date(latestPayment.paidAt || (latestPayment as any).createdAt).toLocaleDateString("id-ID")}
                            </p>
                            {/* Menggunakan casting any juga untuk note jika type-nya belum ada */}
                            {(latestPayment as any).note && (
                              <p className="text-xs text-gray-500 italic truncate max-w-[150px]">"{(latestPayment as any).note}"</p>
                            )}
                            {hasProof && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 mt-1">
                                    <ImageIcon size={10} /> Ada Bukti
                                </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-3 px-4 text-center align-top">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                            inv.status === "PAID" ? "bg-green-100 text-green-700" : 
                            inv.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>
                          {inv.status === "PAID" ? "Lunas" : inv.status === "PENDING" ? "Menunggu" : "Belum"}
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 px-2" onClick={() => handleOpenDetail(inv, latestPayment)} title="Lihat Detail">
                            <Eye size={16} className="mr-1" /> Detail
                          </Button>

                          {inv.status === "PENDING" && (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-8 w-8 p-0" onClick={() => onConfirm(inv.id)} title="Konfirmasi">
                              <Check size={16} />
                            </Button>
                          )}

                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600" onClick={() => onEditAmount(inv)} title="Menu">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <PaymentDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedDetail}
        onConfirm={handleConfirmFromModal}
      />
    </>
  )
}