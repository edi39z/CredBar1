/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Plus,
  CreditCard,
  Settings,
  UserPlus,
  Receipt,
  TrendingUp,
  AlertCircle,
  Users,
  Copy,
  Check,
} from "lucide-react"
import { CreateDuesDialog } from "@/components/create-dues-dialog"
import { CreateDebtDialog } from "@/components/create-debt-dialog"
import { DuesTable } from "@/components/dues-table"
import { DebtTable } from "@/components/debt-table"
import { MembersTable } from "@/components/members-table"

interface RoomDetailProps {
  roomId: string
}

// Mock room data
const mockRoom = {
  id: 1,
  name: "Kos Mawar",
  type: "Kos-kosan",
  role: "Admin",
  members: 8,
  description: "Kos putri di daerah kampus dengan fasilitas lengkap",
  createdAt: "2024-01-15",
  inviteCode: "KOS123",
}

// Mock financial summary
const mockSummary = {
  totalDues: 2400000,
  paidDues: 1800000,
  pendingDues: 600000,
  totalDebts: 450000,
  totalCredits: 200000,
}

export function RoomDetail({ roomId }: RoomDetailProps) {
  const [showCreateDues, setShowCreateDues] = useState(false)
  const [showCreateDebt, setShowCreateDebt] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(mockRoom.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-2xl font-bold text-foreground">{mockRoom.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={mockRoom.role === "Admin" ? "default" : "secondary"}
                    className={mockRoom.role === "Admin" ? "bg-primary shadow-sm" : "bg-secondary shadow-sm"}
                  >
                    {mockRoom.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{mockRoom.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent shadow-sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Undang Anggota
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Iuran</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                Rp {mockSummary.totalDues.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Semua periode</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sudah Dibayar</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Rp {mockSummary.paidDues.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((mockSummary.paidDues / mockSummary.totalDues) * 100)}% dari total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Belum Dibayar</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                Rp {mockSummary.pendingDues.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Perlu ditindaklanjuti</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hutang</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                Rp {mockSummary.totalDebts.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Antar anggota</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Piutang</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                Rp {mockSummary.totalCredits.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Yang akan diterima</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Ringkasan
              </TabsTrigger>
              <TabsTrigger
                value="dues"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Iuran
              </TabsTrigger>
              <TabsTrigger
                value="debts"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Hutang & Piutang
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Anggota
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {activeTab === "dues" && (
                <Button onClick={() => setShowCreateDues(true)} className="bg-primary hover:bg-primary/90 shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Iuran
                </Button>
              )}
              {activeTab === "debts" && (
                <Button onClick={() => setShowCreateDebt(true)} className="bg-primary hover:bg-primary/90 shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Catat Hutang
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-foreground">Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">AS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Andi Setiawan membayar iuran listrik</p>
                      <p className="text-xs text-muted-foreground">2 jam lalu</p>
                    </div>
                    <Badge variant="outline" className="text-accent border-accent font-semibold bg-accent/10">
                      Rp 150.000
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">SR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Sari Rahayu menambah hutang ke Budi</p>
                      <p className="text-xs text-muted-foreground">5 jam lalu</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-destructive border-destructive font-semibold bg-destructive/10"
                    >
                      Rp 50.000
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">BP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Budi Pratama membuat iuran WiFi</p>
                      <p className="text-xs text-muted-foreground">1 hari lalu</p>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary bg-primary/10">
                      Iuran Baru
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-t-4 border-t-secondary">
                <CardHeader>
                  <CardTitle className="text-foreground">Info Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">Dibuat</p>
                      <p className="font-semibold text-foreground">
                        {new Date(mockRoom.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">Kode Undangan</p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold font-mono text-primary">{mockRoom.inviteCode}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-primary/10"
                          onClick={handleCopyInviteCode}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-accent" />
                          ) : (
                            <Copy className="h-3 w-3 text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">Total Anggota</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <p className="font-semibold text-foreground">{mockRoom.members} orang</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">Role Anda</p>
                      <Badge
                        variant={mockRoom.role === "Admin" ? "default" : "secondary"}
                        className={mockRoom.role === "Admin" ? "bg-primary" : "bg-secondary"}
                      >
                        {mockRoom.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-muted-foreground text-sm font-medium mb-2">Deskripsi</p>
                    <p className="text-sm text-foreground leading-relaxed">{mockRoom.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dues">
            <DuesTable />
          </TabsContent>

          <TabsContent value="debts">
            <DebtTable />
          </TabsContent>

          <TabsContent value="members">
            <MembersTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateDuesDialog open={showCreateDues} onOpenChange={setShowCreateDues} />
      <CreateDebtDialog open={showCreateDebt} onOpenChange={setShowCreateDebt} />
    </div>
  )
}
