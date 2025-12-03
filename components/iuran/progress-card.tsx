import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Due } from "./shared"

interface ProgressCardProps {
  progress: number
  lunas: number
  menunggu: number
  belumBayar: number
  due: Due
}

export function ProgressCard({ progress, lunas, menunggu, belumBayar, due }: ProgressCardProps) {
  return (
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
  )
}