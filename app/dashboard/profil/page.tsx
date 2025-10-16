"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface UserProfile {
  nama: string
  email: string
  noTelepon: string
  alamat: string
  kota: string
  provinsi: string
  kodePos: string
  tanggalBergabung: string
}

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    nama: "Budi Santoso",
    email: "budi.santoso@email.com",
    noTelepon: "08123456789",
    alamat: "Jl. Merdeka No. 123",
    kota: "Jakarta",
    provinsi: "DKI Jakarta",
    kodePos: "12345",
    tanggalBergabung: "2024-01-15",
  })

  const [formData, setFormData] = useState(profile)

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(profile)
  }

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(profile)
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const stats = [
    {
      label: "Grup Aktif",
      value: "5",
      icon: "👥",
    },
    {
      label: "Total Pembayaran",
      value: "Rp 2.5M",
      icon: "💰",
    },
    {
      label: "Transaksi",
      value: "24",
      icon: "📊",
    },
    {
      label: "Anggaran Terkumpul",
      value: "Rp 1.2M",
      icon: "📈",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600 mt-2">Kelola informasi akun dan pengaturan pribadi Anda</p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden mb-8">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar and Name */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center text-white text-5xl border-4 border-white">
                <User size={64} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">{profile.nama}</h2>
                <p className="text-gray-600 mt-1">
                  Bergabung sejak {new Date(profile.tanggalBergabung).toLocaleDateString("id-ID")}
                </p>
              </div>
              <Button
                onClick={isEditing ? handleCancel : handleEdit}
                className={`w-full md:w-auto ${isEditing
                  ? "bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
                  : "bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  }`}
              >
                {isEditing ? (
                  <>
                    <X size={20} />
                    Batal
                  </>
                ) : (
                  <>
                    <Edit2 size={20} />
                    Edit Profil
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-2xl mb-2">{stat.icon}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.nama}
                        onChange={(e) => handleChange("nama", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.nama}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      No. Telepon
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={formData.noTelepon}
                        onChange={(e) => handleChange("noTelepon", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.noTelepon}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Kota
                    </label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.kota}
                        onChange={(e) => handleChange("kota", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.kota}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Alamat</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={formData.alamat}
                        onChange={(e) => handleChange("alamat", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.alamat}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provinsi</label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={formData.provinsi}
                          onChange={(e) => handleChange("provinsi", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{profile.provinsi}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Pos</label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={formData.kodePos}
                          onChange={(e) => handleChange("kodePos", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{profile.kodePos}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button onClick={handleCancel} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900">
                    Batal
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
