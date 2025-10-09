"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TrendingDown, TrendingUp, DollarSign, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock debt data
const mockDebts = [
  {
    id: 1,
    type: "debt", // I owe someone
    member: { name: "Andi Setiawan", avatar: "AS" },
    amount: 150000,
    description: "Bayar makan bersama",
    dueDate: "2024-02-15",
    status: "pending",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    type: "credit", // Someone owes me
    member: { name: "Sari Rahayu", avatar: "SR" },
    amount: 75000,
    description: "Pinjam uang bensin",
    dueDate: "2024-02-10",
    status: "pending",
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    type: "debt",
    member: { name: "Budi Pratama", avatar: "BP" },
    amount: 200000,
    description: "Bayar listrik bulan lalu",
    dueDate: "2024-01-30",
    status: "paid",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    type: "credit",
    member: { name: "Dewi Lestari", avatar: "DL" },
    amount: 50000,
    description: "Pinjam untuk beli pulsa",
    dueDate: "2024-02-05",
    status: "overdue",
    createdAt: "2024-01-10",
  },
]

export function DebtTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredDebts = mockDebts.filter((debt) => {
    const matchesSearch =
      debt.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || debt.type === typeFilter
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Belum Dibayar</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Terlambat</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const totalDebts = mockDebts
    .filter((d) => d.type === "debt" && d.status !== "paid")
    .reduce((sum, d) => sum + d.amount, 0)

  const totalCredits = mockDebts
    .filter((d) => d.type === "credit" && d.status !== "paid")
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hutang</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalDebts.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Yang harus dibayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Piutang</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rp {totalCredits.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">Yang akan diterima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalCredits - totalDebts >= 0 ? "text-green-600" : "text-red-600"}`}>
              Rp {Math.abs(totalCredits - totalDebts).toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">{totalCredits - totalDebts >= 0 ? "Surplus" : "Defisit"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockDebts.filter((d) => d.status === "overdue").length}
            </div>
            <p className="text-xs text-muted-foreground">Perlu segera dibayar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari hutang/piutang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={typeFilter === "all" ? "default" : "glass-outline"} size="sm" onClick={() => setTypeFilter("all")}>
            Semua
          </Button>
          <Button
            variant={typeFilter === "debt" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setTypeFilter("debt")}
            className="text-red-600"
          >
            Hutang Saya
          </Button>
          <Button
            variant={typeFilter === "credit" ? "default" : "glass-outline"}
            size="sm"
            onClick={() => setTypeFilter("credit")}
            className="text-blue-600"
          >
            Piutang Saya
          </Button>
        </div>
      </div>

      {/* Debts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Hutang & Piutang</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis</TableHead>
                <TableHead>Dengan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={debt.type === "debt" ? "text-red-600 border-red-200" : "text-blue-600 border-blue-200"}
                    >
                      {debt.type === "debt" ? "Hutang" : "Piutang"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{debt.member.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{debt.member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`font-medium ${debt.type === "debt" ? "text-red-600" : "text-blue-600"}`}>
                    {debt.type === "debt" ? "-" : "+"}Rp {debt.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{debt.description}</TableCell>
                  <TableCell>{debt.dueDate ? new Date(debt.dueDate).toLocaleDateString("id-ID") : "-"}</TableCell>
                  <TableCell>{getStatusBadge(debt.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {debt.status === "pending" && (
                          <DropdownMenuItem className="text-green-600">Tandai Lunas</DropdownMenuItem>
                        )}
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
