"use client"

import { useState, useEffect } from "react"
import { Bell, Trash2, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Notifikasi {
  id: string
  tipe: "info" | "warning" | "success"
  judul: string
  pesan: string
  tanggal: string
  dibaca: boolean
}

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notifikasi[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTipe, setFilterTipe] = useState<"semua" | "info" | "warning" | "success">("semua")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== id))
      }
    } catch (error) {
      console.error("Gagal menghapus")
    }
  }

  const filteredNotifications =
    filterTipe === "semua" ? notifications : notifications.filter((n) => n.tipe === filterTipe)

  const getNotificationIcon = (tipe: string) => {
    switch (tipe) {
      case "success": return <CheckCircle size={24} className="text-green-600" />
      case "warning": return <AlertCircle size={24} className="text-yellow-600" />
      case "info": return <Info size={24} className="text-blue-600" />
      default: return <Bell size={24} className="text-gray-600" />
    }
  }

  const getNotificationColor = (tipe: string) => {
    switch (tipe) {
      case "success": return "bg-green-50 border-l-4 border-green-500"
      case "warning": return "bg-yellow-50 border-l-4 border-yellow-500"
      case "info": return "bg-blue-50 border-l-4 border-blue-500"
      default: return "bg-gray-50 border-l-4 border-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-600 mt-2">
              Pusat informasi pembayaran dan aktivitas grup Anda
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["semua", "info", "warning", "success"] as const).map((tipe) => (
            <Button
              key={tipe}
              onClick={() => setFilterTipe(tipe)}
              className={`capitalize ${filterTipe === tipe
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tipe === "semua" ? "Semua" : tipe === "info" ? "Info" : tipe === "warning" ? "Peringatan" : "Sukses"}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`rounded-xl shadow-md border-0 p-4 transition-all ${getNotificationColor(notif.tipe)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.tipe)}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{notif.judul}</h3>
                    <p className="text-gray-700 text-sm mt-1">{notif.pesan}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notif.tanggal).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleDelete(notif.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-white rounded-xl shadow-md border-0 p-8 text-center">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">Tidak ada notifikasi</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}