"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Bell,
  Search,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReminderSettingsDialog } from "@/components/reminder-settings-dialog"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "payment_due",
    title: "Pembayaran Jatuh Tempo",
    message: "Iuran listrik Januari 2024 akan jatuh tempo dalam 2 hari",
    room: "Kos Mawar",
    amount: 150000,
    dueDate: "2024-01-31",
    isRead: false,
    createdAt: "2024-01-29T10:00:00Z",
    priority: "high",
  },
  {
    id: 2,
    type: "payment_received",
    title: "Pembayaran Diterima",
    message: "Andi Setiawan telah membayar iuran WiFi sebesar Rp 75.000",
    room: "Kos Mawar",
    member: "Andi Setiawan",
    amount: 75000,
    isRead: false,
    createdAt: "2024-01-29T08:30:00Z",
    priority: "medium",
  },
  {
    id: 3,
    type: "payment_overdue",
    title: "Pembayaran Terlambat",
    message: "3 anggota belum membayar iuran yang sudah jatuh tempo",
    room: "Tim Futsal",
    count: 3,
    isRead: true,
    createdAt: "2024-01-28T15:20:00Z",
    priority: "high",
  },
  {
    id: 4,
    type: "new_member",
    title: "Anggota Baru",
    message: "Dewi Lestari bergabung dengan room Arisan Keluarga",
    room: "Arisan Keluarga",
    member: "Dewi Lestari",
    isRead: true,
    createdAt: "2024-01-28T12:15:00Z",
    priority: "low",
  },
  {
    id: 5,
    type: "reminder_sent",
    title: "Pengingat Terkirim",
    message: "Pengingat pembayaran telah dikirim ke 5 anggota",
    room: "Kos Mawar",
    count: 5,
    isRead: true,
    createdAt: "2024-01-27T09:00:00Z",
    priority: "low",
  },
]

// Mock reminders data
const mockReminders = [
  {
    id: 1,
    type: "payment_due",
    title: "Pengingat Iuran Listrik",
    description: "Kirim pengingat 3 hari sebelum jatuh tempo",
    room: "Kos Mawar",
    dueDate: "2024-02-01",
    recipients: 8,
    status: "scheduled",
    nextSend: "2024-01-29T09:00:00Z",
  },
  {
    id: 2,
    type: "payment_overdue",
    title: "Pengingat Pembayaran Terlambat",
    description: "Kirim pengingat untuk pembayaran yang terlambat",
    room: "Tim Futsal",
    recipients: 3,
    status: "sent",
    lastSent: "2024-01-28T10:00:00Z",
  },
  {
    id: 3,
    type: "monthly_summary",
    title: "Ringkasan Bulanan",
    description: "Kirim laporan keuangan bulanan ke semua admin",
    room: "Semua Room",
    recipients: 5,
    status: "scheduled",
    nextSend: "2024-02-01T08:00:00Z",
  },
]

export function NotificationCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showSettings, setShowSettings] = useState(false)

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notification.type === filterType
    return matchesSearch && matchesType
  })

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_due":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "payment_received":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "payment_overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "new_member":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "reminder_sent":
        return <Mail className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Tinggi</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Sedang</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rendah</Badge>
      default:
        return null
    }
  }

  const getReminderStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Terjadwal</Badge>
      case "sent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terkirim</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gagal</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Baru saja"
    if (diffInHours < 24) return `${diffInHours} jam lalu`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} hari lalu`
    return date.toLocaleDateString("id-ID")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[rgb(30,58,138)] font-[family-name:var(--font-poppins)]">
                  Notifikasi & Pengingat
                </h1>
                <p className="text-[rgb(107,114,128)]">
                  {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="border-[rgb(229,231,235)] hover:bg-[rgb(243,244,246)]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Pengaturan
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notifications" className="relative">
              Notifikasi
              {unreadCount > 0 && <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="reminders">Pengingat</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari notifikasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  Semua
                </Button>
                <Button
                  variant={filterType === "payment_due" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("payment_due")}
                >
                  Jatuh Tempo
                </Button>
                <Button
                  variant={filterType === "payment_overdue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("payment_overdue")}
                >
                  Terlambat
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.room}</span>
                            <span>{formatTimeAgo(notification.createdAt)}</span>
                            {notification.amount && (
                              <span className="font-medium">Rp {notification.amount.toLocaleString("id-ID")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            {notification.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            {/* Reminders List */}
            <div className="space-y-4">
              {mockReminders.map((reminder) => (
                <Card key={reminder.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{reminder.title}</h4>
                          {getReminderStatusBadge(reminder.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Room:</span>
                            <p className="font-medium">{reminder.room}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Penerima:</span>
                            <p className="font-medium">{reminder.recipients} orang</p>
                          </div>
                          {reminder.nextSend && (
                            <div>
                              <span className="text-muted-foreground">Kirim Berikutnya:</span>
                              <p className="font-medium">{new Date(reminder.nextSend).toLocaleDateString("id-ID")}</p>
                            </div>
                          )}
                          {reminder.lastSent && (
                            <div>
                              <span className="text-muted-foreground">Terakhir Dikirim:</span>
                              <p className="font-medium">{new Date(reminder.lastSent).toLocaleDateString("id-ID")}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Pengingat</DropdownMenuItem>
                          <DropdownMenuItem>Kirim Sekarang</DropdownMenuItem>
                          <DropdownMenuItem>Lihat Riwayat</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notifikasi Email</Label>
                      <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-reminders">Pengingat Pembayaran</Label>
                      <p className="text-sm text-muted-foreground">Kirim pengingat sebelum jatuh tempo</p>
                    </div>
                    <Switch id="payment-reminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="overdue-alerts">Peringatan Terlambat</Label>
                      <p className="text-sm text-muted-foreground">Notifikasi untuk pembayaran terlambat</p>
                    </div>
                    <Switch id="overdue-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="member-activity">Aktivitas Anggota</Label>
                      <p className="text-sm text-muted-foreground">Notifikasi saat ada anggota baru atau keluar</p>
                    </div>
                    <Switch id="member-activity" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthly-reports">Laporan Bulanan</Label>
                      <p className="text-sm text-muted-foreground">Terima ringkasan keuangan bulanan</p>
                    </div>
                    <Switch id="monthly-reports" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Pengingat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reminder-days">Hari Sebelum Jatuh Tempo</Label>
                    <Input id="reminder-days" type="number" defaultValue="3" min="1" max="30" />
                  </div>
                  <div>
                    <Label htmlFor="reminder-time">Waktu Pengiriman</Label>
                    <Input id="reminder-time" type="time" defaultValue="09:00" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reminder-frequency">Frekuensi Pengingat Terlambat</Label>
                  <select className="w-full mt-1 p-2 border rounded-md" defaultValue="weekly">
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Dialog */}
      <ReminderSettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </div>
  )
}
