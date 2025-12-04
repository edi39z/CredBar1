import { Card } from "@/components/ui/card"
import { Due } from "./shared"

export function InfoCard({ due }: { due: Due }) {
  if (!due) return null

  return (
    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Iuran</h3>
        <div className="space-y-4">
          
          {/* 1. UPDATE: Menampilkan Nomor Rekening */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Nomor Rekening / QR</p>
            <p className="font-bold text-gray-900 text-sm break-all">
              {due.accountNumber || "-"}
            </p>
          </div>

          {/* 2. UPDATE: Menampilkan Deskripsi (Jika ada) */}
          {due.description && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Deskripsi</p>
              <p className="font-bold text-gray-900 text-sm break-all">
                {due.description}
              </p>
            </div>
          )}

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Jatuh Tempo</p>
            <p className="font-bold text-gray-900 text-sm">
              {due.nextDueDate 
                ? new Date(due.nextDueDate).toLocaleDateString("id-ID", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Dibuat Tanggal</p>
            <p className="font-bold text-gray-900 text-sm">
              {due.createdAt 
                ? new Date(due.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", 
                    month: "long", 
                    year: "numeric"
                  })
                : "-"}
            </p>
          </div>
          
        </div>
      </div>
    </Card>
  )
}