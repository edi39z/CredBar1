/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, CreditCard, Users, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock dues data
const mockDues = [
  {
    id: 1,
    name: "Listrik Januari 2024",
    amount: 150000,
    dueDate: "2024-01-31",
    status: "paid",
    paidCount: 8,
    totalMembers: 8,
    createdAt: "2024-01-01",
    isRecurring: true,
    frequency: "monthly",
  },
  {
    id: 2,
    name: "WiFi Januari 2024",
    amount: 75000,
    dueDate: "2024-01-25",
    status: "partial",
    paidCount: 6,
    totalMembers: 8,
    createdAt: "2024-01-01",
    isRecurring: true,
    frequency: "monthly",
  },
  {
    id: 3,
    name: "Air Januari 2024",
    amount: 50000,
    dueDate: "2024-01-28",
    status: "pending",
    paidCount: 2,
    totalMembers: 8,
    createdAt: "2024-01-01",
    isRecurring: true,
    frequency: "monthly",
  },
  {
    id: 4,
    name: "Kebersihan Bulanan",
    amount: 25000,
    dueDate: "2024-02-05",
    status: "pending",
    paidCount: 0,
    totalMembers: 8,
    createdAt: "2024-01-15",
    isRecurring: true,
    frequency: "monthly",
  },
]

export function DuesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDues = mockDues.filter((due) => {
    const matchesSearch = due.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || due.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, paidCount: number, totalMembers: number) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Sebagian</Badge>
      case "pending":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Belum Dibayar</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getProgressPercentage = (paidCount: number, totalMembers: number) => {
    return Math.round((paidCount / totalMembers) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Iuran</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDues.length}</div>
            <p className="text-xs text-muted-foreground">Periode aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunas</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockDues.filter((d) => d.status === "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">Sudah dibayar semua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sebagian</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockDues.filter((d) => d.status === "partial").length}
            </div>
            <p className="text-xs text-muted-foreground">Belum semua bayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockDues.filter((d) => d.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Perlu ditindaklanjuti</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari iuran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Belum Dibayar
          </Button>
          <Button
            variant={statusFilter === "partial" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setStatusFilter("partial")}
          >
            Sebagian
          </Button>
          <Button
            variant={statusFilter === "paid" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setStatusFilter("paid")}
          >
            Lunas
          </Button>
        </div>
      </div>

      {/* Dues Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Iuran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Iuran</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDues.map((due) => (
                <TableRow key={due.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{due.name}</p>
                      {due.isRecurring && (
                        <p className="text-xs text-muted-foreground">
                          Berulang {due.frequency === "monthly" ? "bulanan" : due.frequency}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">Rp {due.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{new Date(due.dueDate).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>
                          {due.paidCount}/{due.totalMembers}
                        </span>
                        <span>{getProgressPercentage(due.paidCount, due.totalMembers)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(due.paidCount, due.totalMembers)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(due.status, due.paidCount, due.totalMembers)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit Iuran</DropdownMenuItem>
                        <DropdownMenuItem>Kirim Pengingat</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
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
