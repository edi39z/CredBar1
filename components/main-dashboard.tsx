"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, UserPlus, Receipt } from "lucide-react"
import { CreateRoomDialog } from "@/components/create-room-dialog"
import { JoinRoomDialog } from "@/components/join-room-dialog"
import { DashboardHeader } from "@/components/dashboard-header"

// Mock data for rooms
const mockRooms = [
  {
    id: 1,
    name: "Kos Mawar",
    type: "Kos-kosan",
    role: "Admin",
    members: 8,
    totalDues: 2400000,
    pendingPayments: 3,
    lastActivity: "2 jam lalu",
  },
  {
    id: 2,
    name: "Arisan Keluarga",
    type: "Arisan",
    role: "Member",
    members: 12,
    totalDues: 1200000,
    pendingPayments: 0,
    lastActivity: "1 hari lalu",
  },
  {
    id: 3,
    name: "Tim Futsal",
    type: "Olahraga",
    role: "Admin",
    members: 15,
    totalDues: 750000,
    pendingPayments: 5,
    lastActivity: "3 jam lalu",
  },
]

export function MainDashboard() {
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [showJoinRoom, setShowJoinRoom] = useState(false)

  const totalBalance = mockRooms.reduce((sum, room) => sum + room.totalDues, 0)
  const totalPendingPayments = mockRooms.reduce((sum, room) => sum + room.pendingPayments, 0)
  const outstandingEstimate = mockRooms.reduce((sum, r) => sum + r.pendingPayments * 250000, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Dashboard" subtitle="Ringkasan iuran lintas room" showSearch />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Room - Blue */}
          <Card className="hover:shadow-lg transition-shadow bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Room</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{mockRooms.length}</div>
              <p className="text-xs/5 opacity-90 mt-1">Room aktif</p>
            </CardContent>
          </Card>

          {/* Tagihan yang Harus Dibayar - Coral */}
          <Card className="hover:shadow-lg transition-shadow bg-destructive text-destructive-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tagihan yang Harus Dibayar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">Rp {outstandingEstimate.toLocaleString("id-ID")}</div>
              <p className="text-xs/5 opacity-90 mt-1">Estimasi dari semua room</p>
            </CardContent>
          </Card>

          {/* Pembayaran Tertunda - Violet */}
          <Card className="hover:shadow-lg transition-shadow bg-secondary text-secondary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pembayaran Tertunda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{totalPendingPayments}</div>
              <p className="text-xs/5 opacity-90 mt-1">Perlu ditindaklanjuti</p>
            </CardContent>
          </Card>

          {/* Status - Emerald */}
          <Card className="hover:shadow-lg transition-shadow bg-success text-success-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">Aktif</div>
              <p className="text-xs/5 opacity-90 mt-1">Status akun</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="primary" onClick={() => setShowCreateRoom(true)} className="shadow-md">
            <Plus className="h-4 w-4" />
            Buat Room Baru
          </Button>
          <Button variant="secondary" onClick={() => setShowJoinRoom(true)} className="shadow-md">
            <UserPlus className="h-4 w-4" />
            Gabung Room
          </Button>
          <Button variant="success" onClick={() => (window.location.href = "/payment-status")} className="shadow-md">
            <Receipt className="h-4 w-4" />
            Status Pembayaran
          </Button>
          {/* Keluar (destructive) */}
          <Button variant="destructive" className="shadow-md" onClick={() => (window.location.href = "/login")}>
            {/* icon kept minimal to ensure visibility; you can swap with LogOut if installed */}
            Keluar
          </Button>
        </div>

        {/* Room cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Room Saya</h2>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {mockRooms.length} Room
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRooms.map((room) => (
              <Card
                key={room.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border bg-card overflow-hidden"
              >
                <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {room.name}
                    </CardTitle>
                    <Badge
                      variant={room.role === "Admin" ? "default" : "secondary"}
                      className={room.role === "Admin" ? "bg-primary shadow-sm" : "bg-secondary shadow-sm"}
                    >
                      {room.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{room.type}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-lg">
                    <span className="flex items-center gap-2 text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{room.members} anggota</span>
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{room.lastActivity}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm bg-accent/5 p-2.5 rounded-lg">
                      <span className="text-foreground font-medium">Total Iuran:</span>
                      <span className="font-bold text-accent">Rp {room.totalDues.toLocaleString("id-ID")}</span>
                    </div>
                    {room.pendingPayments > 0 && (
                      <div className="flex justify-between text-sm bg-warning/5 p-2.5 rounded-lg">
                        <span className="text-foreground font-medium">Pembayaran Tertunda:</span>
                        <Badge variant="outline" className="font-bold text-warning border-warning bg-warning/10">
                          {room.pendingPayments}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 shadow-sm hover:shadow-md transition-all"
                      onClick={() => (window.location.href = `/room/${room.id}`)}
                    >
                      Buka Room
                    </Button>
                    {room.role === "Admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
                      >
                        Kelola
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs remain unchanged */}
      <CreateRoomDialog open={showCreateRoom} onOpenChange={setShowCreateRoom} />
      <JoinRoomDialog open={showJoinRoom} onOpenChange={setShowJoinRoom} />
    </div>
  )
}
