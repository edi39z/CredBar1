/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Send, Printer } from "lucide-react"

interface InvoiceDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: any
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice }: InvoiceDetailDialogProps) {
  if (!invoice) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Dibayar</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Menunggu</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Terlambat</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Invoice</DialogTitle>
          <DialogDescription>
            Invoice {invoice.id} - {invoice.member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Invoice {invoice.id}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Dibuat: {new Date(invoice.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Dari:</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Kos Mawar</p>
                    <p>Admin: Budi Pratama</p>
                    <p>admin@kosmawar.com</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Kepada:</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{invoice.member.name}</p>
                    <p>{invoice.member.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item:</span>
                  <span>{invoice.dueName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah:</span>
                  <span className="font-medium">Rp {invoice.amount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jatuh Tempo:</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString("id-ID")}</span>
                </div>
                {invoice.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dikirim:</span>
                    <span>{new Date(invoice.sentAt).toLocaleDateString("id-ID")}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>Rp {invoice.amount.toLocaleString("id-ID")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {invoice.status === "paid" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Informasi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Pembayaran:</span>
                  <span>{new Date(invoice.paidDate).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="capitalize">{invoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah Dibayar:</span>
                  <span className="font-medium text-green-600">Rp {invoice.amount.toLocaleString("id-ID")}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Instructions */}
          {(invoice.status === "pending" || invoice.status === "overdue") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instruksi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h5 className="font-medium mb-1">Transfer Bank:</h5>
                  <p className="text-muted-foreground">BCA: 1234567890 a.n. Budi Pratama</p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">E-Wallet:</h5>
                  <p className="text-muted-foreground">OVO/GoPay: 081234567890</p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Tunai:</h5>
                  <p className="text-muted-foreground">Serahkan langsung ke admin</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div className="flex gap-2">
            {invoice.status !== "paid" && (
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Kirim Ulang
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)}>Tutup</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
