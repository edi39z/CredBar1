"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useCurrentUser } from "@/hooks/use-current-user"

interface Member {
  id: string
  nama: string
  email: string
  status: "lunas" | "menunggu" | "terlambat"
  tanggalBayar?: string
  nominal: number
}

interface Grup {
  id: string
  nama: string
  deskripsi: string
  nominal: number
  tanggalJatuhTempo: string
  jumlahAnggota: number
  totalTerkumpul: number
  status: "aktif" | "selesai"
  role: "admin" | "member"
  members: Member[]
  createdAt: string
}

export default function GrupPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const [groups, setGroups] = useState<Grup[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  })

  useEffect(() => {
    if (!userLoading && user?.id) {
      fetchGroups()
    } else if (!userLoading && !user?.id) {
      setLoading(false)
    }
  }, [userLoading, user?.id])

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "x-user-id": user?.id?.toString() || "",
  })

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rooms", { headers: getAuthHeaders() })
      if (!response.ok) throw new Error("Failed to fetch groups")
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      console.error("Error fetching groups:", error)
      setGroups([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (grup?: Grup) => {
    if (grup) {
      setEditingId(grup.id)
      setFormData({
        nama: grup.nama,
        deskripsi: grup.deskripsi,
      })
    } else {
      setEditingId(null)
      setFormData({
        nama: "",
        deskripsi: "",
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`/api/rooms/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: formData.nama,
            description: formData.deskripsi,
          }),
        })
      } else {
        await fetch("/api/rooms", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nama: formData.nama,
            deskripsi: formData.deskripsi,
            createdById: user?.id,
          }),
        })
      }

      await fetchGroups()
      setShowModal(false)
      setFormData({ nama: "", deskripsi: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus grup ini?")) return
    try {
      await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      await fetchGroups()
    } catch (error) {
      console.error("Error deleting group:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lunas":
        return "bg-green-100 text-green-700"
      case "menunggu":
        return "bg-yellow-100 text-yellow-700"
      case "terlambat":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Anda belum login.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manajemen Grup</h1>
            <p className="text-gray-600 mt-2">Kelola semua grup iuran Anda</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 w-full md:w-auto"
          >
            <Plus size={20} />
            Buat Grup Baru
          </Button>
        </div>

        {/* Grup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {groups.map((grup) => {
            return (
              <Card
                key={grup.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-0"
              >
                <div
                  className={`h-3 ${
                    grup.status === "aktif"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{grup.nama}</h3>

                    {grup.role === "admin" && (
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield size={14} />
                        Admin
                      </div>
                    )}
                  </div>

                  {/* Grid tanpa Hari */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-blue-500" />
                        <span className="text-xs text-gray-600">Anggota</span>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{grup.jumlahAnggota}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={16} className="text-green-500" />
                        <span className="text-xs text-gray-600">Status</span>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        {grup.role === "admin" ? "Admin" : "Member"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/grup/${grup.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2">
                        <Users size={16} />
                        Lihat Detail
                      </Button>
                    </Link>

                    {grup.role === "admin" && (
                      <>
                        <Button
                          onClick={() => handleOpenModal(grup)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleDelete(grup.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? "Edit Grup" : "Buat Grup Baru"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Grup</label>
                    <Input
                      type="text"
                      placeholder="Contoh: Iuran WiFi Kos"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                    />
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                    <Input
                      type="text"
                      placeholder="Deskripsi grup iuran"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                      {editingId ? "Simpan Perubahan" : "Buat Grup"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
