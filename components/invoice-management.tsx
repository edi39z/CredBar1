/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Send,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Download,
  Eye,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { PaymentDialog } from "@/components/payment-dialog"
import { InvoiceDetailDialog } from "@/components/invoice-detail-dialog"

interface InvoiceManagementProps {
  roomId: string
}

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-001",
    dueId: 1,
    dueName: "Listrik Januari 2024",
    member: { name: "Andi Setiawan", avatar: "AS", email: "andi@example.com" },
    amount: 150000,
    status: "paid",
    dueDate: "2024-01-31",
    paidDate: "2024-01-28",
    paymentMethod: "transfer",
    createdAt: "2024-01-01",
    sentAt: "2024-01-01",
  },
  {
    id: "INV-002",
    dueId: 2,
    dueName: "WiFi Januari 2024",
    member: { name: "Sari Rahayu", avatar: "SR", email: "sari@example.com" },
    amount: 75000,
    status: "pending",
    dueDate: "2024-01-25",
    paidDate: null,
    paymentMethod: null,
    createdAt: "2024-01-01",
    sentAt: "2024-01-01",
  },
  {
    id: "INV-003",
    dueId: 1,
    dueName: "Listrik Januari 2024",
    member: { name: "Budi Pratama", avatar: "BP", email: "budi@example.com" },
    amount: 150000,
    status: "overdue",
    dueDate: "2024-01-31",
    paidDate: null,
    paymentMethod: null,
    createdAt: "2024-01-01",
    sentAt: "2024-01-01",
  },
  {
    id: "INV-004",
    dueId: 3,
    dueName: "Air Januari 2024",
    member: { name: "Dewi Lestari", avatar: "DL", email: "dewi@example.com" },
    amount: 50000,
    status: "draft",
    dueDate: "2024-01-28",
    paidDate: null,
    paymentMethod: null,
    createdAt: "2024-01-15",
    sentAt: null,
  },
]

export function InvoiceManagement({ roomId }: InvoiceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.dueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dibayar
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Terlambat
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetail(true)
  }

  const handlePayment = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowPayment(true)
  }

  const totalInvoices = mockInvoices.length
  const paidInvoices = mockInvoices.filter((i) => i.status === "paid").length
  const pendingInvoices = mockInvoices.filter((i) => i.status === "pending").length
  const overdueInvoices = mockInvoices.filter((i) => i.status === "overdue").length
  const totalAmount = mockInvoices.reduce((sum, i) => sum + i.amount, 0)
  const paidAmount = mockInvoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Invoice & Pembayaran</h1>
                <p className="text-muted-foreground">Kelola invoice dan pembayaran room</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateInvoice(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoice</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground">Semua periode</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dibayar</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((paidInvoices / totalInvoices) * 100)}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">Belum dibayar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
              <p className="text-xs text-muted-foreground">Lewat jatuh tempo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Terbayar</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Rp {paidAmount.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground">Dari Rp {totalAmount.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Semua
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Menunggu
            </Button>
            <Button
              variant={statusFilter === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("paid")}
            >
              Dibayar
            </Button>
            <Button
              variant={statusFilter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("overdue")}
            >
              Terlambat
            </Button>
          </div>
        </div>

        {/* Invoice Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibayar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{invoice.member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{invoice.member.name}</p>
                          <p className="text-xs text-muted-foreground">{invoice.member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.dueName}</TableCell>
                    <TableCell className="font-medium">Rp {invoice.amount.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      {invoice.paidDate ? (
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(invoice.paidDate).toLocaleDateString("id-ID")}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{invoice.paymentMethod}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          {invoice.status === "draft" && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Kirim Invoice
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === "pending" || invoice.status === "overdue") && (
                            <DropdownMenuItem onClick={() => handlePayment(invoice)}>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Catat Pembayaran
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Kirim Pengingat
                          </DropdownMenuItem>
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

      {/* Dialogs */}
      <CreateInvoiceDialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice} />
      <PaymentDialog open={showPayment} onOpenChange={setShowPayment} invoice={selectedInvoice} />
      <InvoiceDetailDialog open={showInvoiceDetail} onOpenChange={setShowInvoiceDetail} invoice={selectedInvoice} />
    </div>
  )
}
