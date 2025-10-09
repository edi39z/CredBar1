"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Shield,
  Bell,
  CreditCard,
  Settings,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+62 812-3456-7890",
  address: "Jakarta, Indonesia",
  joinDate: "2024-01-15",
  bio: "Pengelola kos dan komunitas yang aktif",
  totalRooms: 3,
  totalMembers: 35,
  totalTransactions: 127,
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockUser)

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (window.location.href = "/dashboard")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profil Saya</h1>
                <p className="text-sm text-muted-foreground">Kelola informasi profil Anda</p>
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-primary hover:bg-primary/90"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profil
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{formData.name}</h2>
                    <p className="text-muted-foreground">{formData.email}</p>
                    <Badge className="bg-primary">Member Aktif</Badge>
                  </div>
                  <div className="w-full pt-4 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{mockUser.totalRooms}</p>
                        <p className="text-xs text-muted-foreground">Room</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-secondary">{mockUser.totalMembers}</p>
                        <p className="text-xs text-muted-foreground">Anggota</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-accent">{mockUser.totalTransactions}</p>
                        <p className="text-xs text-muted-foreground">Transaksi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Aktivitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Bergabung</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(mockUser.joinDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">Status</span>
                  </div>
                  <Badge className="bg-accent">Terverifikasi</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informasi Pribadi</TabsTrigger>
                <TabsTrigger value="security">Keamanan</TabsTrigger>
                <TabsTrigger value="preferences">Preferensi</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informasi Pribadi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                          Nama Lengkap
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                          className="bg-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10 bg-card"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">
                          Nomor Telepon
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10 bg-card"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-foreground font-medium">
                          Alamat
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            disabled={!isEditing}
                            className="pl-10 bg-card"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-foreground font-medium">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="bg-card resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Keamanan Akun
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-foreground font-medium">
                        Password Saat Ini
                      </Label>
                      <Input id="current-password" type="password" className="bg-card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-foreground font-medium">
                        Password Baru
                      </Label>
                      <Input id="new-password" type="password" className="bg-card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-foreground font-medium">
                        Konfirmasi Password Baru
                      </Label>
                      <Input id="confirm-password" type="password" className="bg-card" />
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">Ubah Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Autentikasi Dua Faktor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">2FA</p>
                        <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan ekstra</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifikasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Email Notifikasi</p>
                        <p className="text-sm text-muted-foreground">Terima notifikasi via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Push Notifikasi</p>
                        <p className="text-sm text-muted-foreground">Notifikasi langsung di browser</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Pengingat Pembayaran</p>
                        <p className="text-sm text-muted-foreground">Ingatkan sebelum jatuh tempo</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Tampilan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Mode Gelap</p>
                        <p className="text-sm text-muted-foreground">Gunakan tema gelap</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Bahasa</Label>
                      <select className="w-full p-2 border rounded-md bg-card">
                        <option>Bahasa Indonesia</option>
                        <option>English</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
