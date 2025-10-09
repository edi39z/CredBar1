"use client"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, CreditCard, TrendingUp, Calendar, Settings, LogOut, Home, UserPlus, Receipt } from "lucide-react"
import { CreateRoomDialog } from "@/components/create-room-dialog"
import { JoinRoomDialog } from "@/components/join-room-dialog"
import { NotificationBadge } from "@/components/notification-badge"

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                {/* Ganti icon CreditCard dengan logo kamu */}
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Image
                    src="/logo.png" // pastikan file ada di folder public
                    alt="Logo CredBar"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>

                <h1 className="text-2xl font-bold text-primary">CredBar</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (window.location.href = "/notifications")}
                className="relative hover:bg-primary/10"
              >
                <NotificationBadge />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar
                className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => (window.location.href = "/profile")}
              >
                <AvatarImage src="/placeholder.svg?height=36&width=36" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">JD</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (window.location.href = "/")}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Room</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockRooms.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Room aktif</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saldo</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">Rp {totalBalance.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-1">Dari semua room</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pembayaran Tertunda</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{totalPendingPayments}</div>
              <p className="text-xs text-muted-foreground mt-1">Perlu ditindaklanjuti</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktivitas</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">Aktif</div>
              <p className="text-xs text-muted-foreground mt-1">Status akun</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setShowCreateRoom(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Buat Room Baru
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowJoinRoom(true)}
            className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Gabung Room
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/payment-status")}
            className="flex items-center gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
          >
            <Receipt className="h-4 w-4" />
            Status Pembayaran
          </Button>
        </div>

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
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
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

      {/* Dialogs */}
      <CreateRoomDialog open={showCreateRoom} onOpenChange={setShowCreateRoom} />
      <JoinRoomDialog open={showJoinRoom} onOpenChange={setShowJoinRoom} />
    </div>
  )
}
