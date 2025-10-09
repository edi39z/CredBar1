/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Upload, CreditCard, Banknote } from "lucide-react"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: any
}

export function PaymentDialog({ open, onOpenChange, invoice }: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    paymentMethod: "",
    paidAmount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
    proofFile: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)

    // Reset form after success
    setTimeout(() => {
      setFormData({
        paymentMethod: "",
        paidAmount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        notes: "",
        proofFile: null,
      })
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, proofFile: file }))
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Catat Pembayaran</DialogTitle>
          <DialogDescription>Catat pembayaran untuk invoice {invoice.id}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pembayaran Berhasil Dicatat!</h3>
            <p className="text-muted-foreground">
              Pembayaran sebesar Rp {Number.parseInt(formData.paidAmount).toLocaleString("id-ID")} telah dicatat.
            </p>
          </div>
        ) : (
          <>
            {/* Invoice Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Detail Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice ID:</span>
                  <span className="font-mono">{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anggota:</span>
                  <span>{invoice.member.name}</span>
                </div>
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
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metode Pembayaran *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleChange("paymentMethod", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center">
                        <Banknote className="h-4 w-4 mr-2" />
                        Tunai
                      </div>
                    </SelectItem>
                    <SelectItem value="transfer">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Transfer Bank
                      </div>
                    </SelectItem>
                    <SelectItem value="ewallet">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        E-Wallet (OVO, GoPay, DANA)
                      </div>
                    </SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Jumlah Dibayar (Rp) *</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder={invoice.amount.toString()}
                    value={formData.paidAmount}
                    onChange={(e) => handleChange("paidAmount", e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Tanggal Pembayaran *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleChange("paymentDate", e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Upload Proof */}
              {formData.paymentMethod && formData.paymentMethod !== "cash" && (
                <div className="space-y-2">
                  <Label htmlFor="proof">Bukti Pembayaran</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Upload screenshot atau foto bukti pembayaran</p>
                        <Input
                          id="proof"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    {formData.proofFile && (
                      <p className="text-sm text-green-600 mt-2">File terpilih: {formData.proofFile.name}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan tentang pembayaran..."
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              {/* Payment Summary */}
              {formData.paidAmount && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status Pembayaran:</span>
                    <span
                      className={`text-sm font-medium ${Number.parseInt(formData.paidAmount) >= invoice.amount
                          ? "text-green-600"
                          : Number.parseInt(formData.paidAmount) > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                    >
                      {Number.parseInt(formData.paidAmount) >= invoice.amount
                        ? "Lunas"
                        : Number.parseInt(formData.paidAmount) > 0
                          ? "Kurang Bayar"
                          : "Belum Dibayar"}
                    </span>
                  </div>
                  {Number.parseInt(formData.paidAmount) < invoice.amount &&
                    Number.parseInt(formData.paidAmount) > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Sisa: Rp {(invoice.amount - Number.parseInt(formData.paidAmount)).toLocaleString("id-ID")}
                      </p>
                    )}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="glass-outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading || !formData.paymentMethod || !formData.paidAmount}>
                  {isLoading ? "Menyimpan..." : "Simpan Pembayaran"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
