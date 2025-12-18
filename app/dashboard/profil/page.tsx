"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2 } from "lucide-react"
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

interface Stat {
  label: string
  value: string
  icon: string
}

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stat[]>([])
  const [formData, setFormData] = useState<UserProfile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile")
      const data = await res.json()
      setProfile(data)
      setStats(data.stats)
      setFormData(data)
    } catch (err) {
      console.error("Gagal load profil")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setProfile(formData)
        setIsEditing(false)
      }
    } catch (err) {
      alert("Gagal menyimpan perubahan")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(profile)
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (formData) setFormData({ ...formData, [field]: value })
  }

  if (loading || !profile || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-600 mt-2">Kelola informasi akun dan pengaturan pribadi Anda</p>
        </div>

        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="px-6 pb-6">
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
                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                className={`w-full md:w-auto ${isEditing ? "bg-gray-500" : "bg-blue-500"} text-white flex items-center gap-2`}
              >
                {isEditing ? <><X size={20} /> Batal</> : <><Edit2 size={20} /> Edit Profil</>}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-2xl mb-2">{stat.icon}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Lengkap", field: "nama", icon: <User size={16} className="inline mr-2" /> },
                    { label: "Email", field: "email", icon: <Mail size={16} className="inline mr-2" />, disabled: true },
                    { label: "No. Telepon", field: "noTelepon", icon: <Phone size={16} className="inline mr-2" /> },
                    { label: "Kota", field: "kota", icon: <MapPin size={16} className="inline mr-2" /> },
                  ].map((item) => (
                    <div key={item.field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{item.icon} {item.label}</label>
                      {isEditing && !item.disabled ? (
                        <Input
                          value={formData[item.field as keyof UserProfile]}
                          onChange={(e) => handleChange(item.field as keyof UserProfile, e.target.value)}
                          className="w-full border-gray-300"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{profile[item.field as keyof UserProfile]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Alamat</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                    {isEditing ? (
                      <Input value={formData.alamat} onChange={(e) => handleChange("alamat", e.target.value)} />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.alamat}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Provinsi</label>
                      {isEditing ? (
                        <Input value={formData.provinsi} onChange={(e) => handleChange("provinsi", e.target.value)} />
                      ) : (
                        <p className="text-gray-900 font-medium">{profile.provinsi}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kode Pos</label>
                      {isEditing ? (
                        <Input value={formData.kodePos} onChange={(e) => handleChange("kodePos", e.target.value)} />
                      ) : (
                        <p className="text-gray-900 font-medium">{profile.kodePos}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button onClick={handleCancel} className="flex-1 bg-gray-300">Batal</Button>
                  <Button onClick={handleSave} className="flex-1 bg-blue-500 text-white gap-2"><Save size={20} /> Simpan Perubahan</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}