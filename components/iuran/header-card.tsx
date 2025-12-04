import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Crown, DollarSign, CheckCircle, AlertCircle, Users } from "lucide-react"
import { Due } from "./shared"

interface HeaderCardProps {
  due: Due
  groupName: string // <--- Ubah dari roomId ke groupName
  isAdmin: boolean
  totalTerkumpul: number
  totalBelumBayar: number
  onAddMember: () => void
  onEdit: () => void
  onDelete: () => void
  onDelegate: () => void
}

export function HeaderCard({
  due,
  groupName, // <--- Gunakan ini
  isAdmin,
  totalTerkumpul,
  totalBelumBayar,
  onAddMember,
  onEdit,
  onDelete,
}: HeaderCardProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 mb-6">
      <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500" />
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{due.name}</h1>
            <p className="text-gray-600 mt-2">{due.description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {isAdmin && (
              <>
                <Button
                  onClick={onAddMember}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                >
                  <Plus size={16} /> Tambah Anggota
                </Button>
                <Button
                  onClick={onEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </Button>
                <Button
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                >
                  <Trash2 size={16} /> Hapus
                </Button>
              </>
            )}
            {isAdmin && (
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 w-fit">
                <Crown size={16} /> Admin
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
            <p className="font-bold text-gray-900 text-lg">Rp {Number(due.amount).toLocaleString("id-ID")}</p>
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
  )
}