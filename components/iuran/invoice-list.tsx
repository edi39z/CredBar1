import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Send, Edit3 } from "lucide-react"
import { Due, Invoice, getStatusColor, getStatusIcon, getStatusLabel } from "./shared"

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
  // onOpenInviteModal, // Tidak dipakai lagi tombolnya
  onPay,
  onConfirm,
  onSendMessage,
  onEditAmount,
}: InvoiceListProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Daftar Tagihan</h2>
          {/* Tombol Tambah Tagihan DIHAPUS */}
        </div>

        <div className="space-y-3">
          {due.invoices.map((invoice) => {
            const memberName = invoice.member?.name || "Unknown Member"
            const memberNominal = invoice.amount
            const memberStatus = invoice.status
            const isOwnInvoice = currentMemberId && String(invoice.memberId) === String(currentMemberId)

            return (
              <div key={invoice.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {memberName} {isOwnInvoice && <span className="text-xs text-blue-500">(Anda)</span>}
                    </p>
                    <p className="text-sm text-gray-600">Rp {Number(memberNominal).toLocaleString("id-ID")}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(memberStatus)}`}
                  >
                    {getStatusIcon(memberStatus)}
                    {getStatusLabel(memberStatus)}
                  </span>
                </div>

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
                  {isAdmin && (
                    <>
                      {memberStatus === "PENDING" && (
                        <Button
                          onClick={() => onConfirm(invoice.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3"
                        >
                          Konfirmasi
                        </Button>
                      )}

                      {(memberStatus === "DRAFT" || memberStatus === "OVERDUE") && !isOwnInvoice && (
                        <Button
                          onClick={() => onEditAmount(invoice)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-3 flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Edit Nominal
                        </Button>
                      )}

                      {(memberStatus === "DRAFT" || memberStatus === "OVERDUE") && isOwnInvoice && (
                        <Button
                          onClick={() => onPay(invoice)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3"
                        >
                          Bayar
                        </Button>
                      )}

                      <Button
                        onClick={() => onSendMessage(invoice)}
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
  )
}