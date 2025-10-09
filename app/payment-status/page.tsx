"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock payment data
const mockPayments = [
  {
    id: "PAY001",
    room: "Kos Mawar",
    description: "Iuran Listrik Januari",
    amount: 150000,
    status: "paid",
    dueDate: "2024-01-31",
    paidDate: "2024-01-28",
    method: "Transfer Bank",
    member: "Anda",
  },
  {
    id: "PAY002",
    room: "Kos Mawar",
    description: "Iuran WiFi Januari",
    amount: 75000,
    status: "paid",
    dueDate: "2024-01-31",
    paidDate: "2024-01-29",
    method: "E-Wallet",
    member: "Anda",
  },
  {
    id: "PAY003",
    room: "Tim Futsal",
    description: "Iuran Lapangan Februari",
    amount: 50000,
    status: "pending",
    dueDate: "2024-02-15",
    paidDate: null,
    method: null,
    member: "Anda",
  },
  {
    id: "PAY004",
    room: "Arisan Keluarga",
    description: "Arisan Bulan Januari",
    amount: 100000,
    status: "overdue",
    dueDate: "2024-01-25",
    paidDate: null,
    method: null,
    member: "Anda",
  },
  {
    id: "PAY005",
    room: "Kos Mawar",
    description: "Iuran Air Januari",
    amount: 50000,
    status: "paid",
    dueDate: "2024-01-31",
    paidDate: "2024-01-30",
    method: "Cash",
    member: "Anda",
  },
]

export default function PaymentStatusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRoom, setFilterRoom] = useState("all")

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesRoom = filterRoom === "all" || payment.room === filterRoom
    return matchesSearch && matchesStatus && matchesRoom
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-accent text-accent-foreground hover:bg-accent">
            <CheckCircle className="h-3 w-3 mr-1" />
            Lunas
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning">
            <Clock className="h-3 w-3 mr-1" />
            Tertunda
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Terlambat
          </Badge>
        )
      default:
        return null
    }
  }

  const totalPaid = mockPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = mockPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = mockPayments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)
  const paidCount = mockPayments.filter((p) => p.status === "paid").length
  const pendingCount = mockPayments.filter((p) => p.status === "pending").length
  const overdueCount = mockPayments.filter((p) => p.status === "overdue").length

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
                <h1 className="text-2xl font-bold text-foreground">Status Pembayaran</h1>
                <p className="text-sm text-muted-foreground">Pantau semua pembayaran Anda</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Terbayar</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Rp {totalPaid.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-1">{paidCount} pembayaran</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tertunda</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">Rp {totalPending.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingCount} pembayaran</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terlambat</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">Rp {totalOverdue.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-1">{overdueCount} pembayaran</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pembayaran</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockPayments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Semua transaksi</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pembayaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="pending">Tertunda</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRoom} onValueChange={setFilterRoom}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Room</SelectItem>
                  <SelectItem value="Kos Mawar">Kos Mawar</SelectItem>
                  <SelectItem value="Tim Futsal">Tim Futsal</SelectItem>
                  <SelectItem value="Arisan Keluarga">Arisan Keluarga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Table */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Room</TableHead>
                    <TableHead className="font-semibold">Deskripsi</TableHead>
                    <TableHead className="font-semibold">Jumlah</TableHead>
                    <TableHead className="font-semibold">Jatuh Tempo</TableHead>
                    <TableHead className="font-semibold">Tanggal Bayar</TableHead>
                    <TableHead className="font-semibold">Metode</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.room}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="font-semibold">Rp {payment.amount.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(payment.dueDate).toLocaleDateString("id-ID")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paidDate ? (
                          new Date(payment.paidDate).toLocaleDateString("id-ID")
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.method ? (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {payment.method}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.status !== "paid" && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Bayar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
