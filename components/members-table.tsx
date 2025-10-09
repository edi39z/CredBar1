"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Crown, User, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock members data
const mockMembers = [
  {
    id: 1,
    name: "Budi Pratama",
    email: "budi@example.com",
    avatar: "BP",
    role: "Admin",
    joinedAt: "2024-01-01",
    totalPaid: 450000,
    totalDue: 500000,
    status: "active",
    lastActivity: "2 jam lalu",
  },
  {
    id: 2,
    name: "Andi Setiawan",
    email: "andi@example.com",
    avatar: "AS",
    role: "Member",
    joinedAt: "2024-01-02",
    totalPaid: 300000,
    totalDue: 300000,
    status: "active",
    lastActivity: "1 hari lalu",
  },
  {
    id: 3,
    name: "Sari Rahayu",
    email: "sari@example.com",
    avatar: "SR",
    role: "Member",
    joinedAt: "2024-01-03",
    totalPaid: 250000,
    totalDue: 300000,
    status: "active",
    lastActivity: "3 jam lalu",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    avatar: "DL",
    role: "Member",
    joinedAt: "2024-01-05",
    totalPaid: 200000,
    totalDue: 300000,
    status: "active",
    lastActivity: "5 jam lalu",
  },
  {
    id: 5,
    name: "Eko Wijaya",
    email: "eko@example.com",
    avatar: "EW",
    role: "Member",
    joinedAt: "2024-01-10",
    totalPaid: 150000,
    totalDue: 300000,
    status: "inactive",
    lastActivity: "1 minggu lalu",
  },
]

export function MembersTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Tidak Aktif</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPaymentStatus = (totalPaid: number, totalDue: number) => {
    const percentage = (totalPaid / totalDue) * 100
    if (percentage >= 100) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
    } else if (percentage >= 50) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Sebagian</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Menunggak</Badge>
    }
  }

  const activeMembers = mockMembers.filter((m) => m.status === "active").length
  const totalPaid = mockMembers.reduce((sum, m) => sum + m.totalPaid, 0)
  const totalDue = mockMembers.reduce((sum, m) => sum + m.totalDue, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMembers.length}</div>
            <p className="text-xs text-muted-foreground">{activeMembers} aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockMembers.filter((m) => m.role === "Admin").length}
            </div>
            <p className="text-xs text-muted-foreground">Pengelola room</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terbayar</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalPaid.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Dari semua anggota</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Pembayaran</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((totalPaid / totalDue) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Rata-rata</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari anggota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="glass-outline">
          <Users className="h-4 w-4 mr-2" />
          Undang Anggota
        </Button>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Status Bayar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktivitas Terakhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === "Admin" ? "default" : "secondary"}>
                      {member.role === "Admin" && <Crown className="h-3 w-3 mr-1" />}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(member.joinedAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Rp {member.totalPaid.toLocaleString("id-ID")}</span>
                        <span className="text-muted-foreground"> / Rp {member.totalDue.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((member.totalPaid / member.totalDue) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentStatus(member.totalPaid, member.totalDue)}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.lastActivity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                        <DropdownMenuItem>Kirim Pesan</DropdownMenuItem>
                        <DropdownMenuItem>Riwayat Pembayaran</DropdownMenuItem>
                        {member.role !== "Admin" && (
                          <>
                            <DropdownMenuItem>Jadikan Admin</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Keluarkan</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
