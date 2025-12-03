import { Card } from "@/components/ui/card"
// Pastikan path import Due benar (sesuai struktur folder Anda)
import { Due } from "./shared" 

// PENTING: Harus "export function", JANGAN "export default function"
export function InfoCard({ due }: { due: Due }) {
  // Guard clause: Cegah error jika data due belum ada/null saat render
  if (!due) return null; 

  return (
    <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Iuran</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Nomor Rekening / QR</p>
            <p className="font-bold text-gray-900 text-sm break-all">{due.description || "-"}</p>
          </div>
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
              {due.startDate 
                ? new Date(due.startDate).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}