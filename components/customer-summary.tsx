"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddCustomerForm } from "@/components/add-customer-form"

const mockCustomers = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@email.com",
    phone: "081234567890",
    job: "Karyawan Swasta",
    income: "Rp 8.000.000",
    status: "valid",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@email.com",
    phone: "081234567891",
    job: "Wiraswasta",
    income: "Rp 12.000.000",
    status: "pending",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081234567892",
    job: "PNS",
    income: "Rp 6.500.000",
    status: "valid",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    phone: "081234567893",
    job: "Guru",
    income: "Rp 5.000.000",
    status: "invalid",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    email: "rudi.hermawan@email.com",
    phone: "081234567894",
    job: "Dokter",
    income: "Rp 25.000.000",
    status: "pending",
    createdAt: "2024-01-11",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "valid":
      return <Badge className="bg-success text-success-foreground">Valid</Badge>
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "invalid":
      return <Badge variant="destructive">Invalid</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function CustomerSummary() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Nasabah Terbaru</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Nasabah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Data Nasabah Baru</DialogTitle>
                <DialogDescription>
                  Isi formulir di bawah ini untuk menambahkan data nasabah baru. Data akan menunggu validasi admin.
                </DialogDescription>
              </DialogHeader>
              <AddCustomerForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Nama</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Pekerjaan</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Penghasilan</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium text-foreground">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="py-3 px-2 text-sm text-foreground">{customer.job}</td>
                  <td className="py-3 px-2 text-sm text-foreground">{customer.income}</td>
                  <td className="py-3 px-2">{getStatusBadge(customer.status)}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="glass-outline">Lihat Semua Nasabah</Button>
        </div>
      </CardContent>
    </Card>
  )
}
