/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data
const mockDues = [
  { id: 1, name: "Listrik Januari 2024", amount: 150000 },
  { id: 2, name: "WiFi Januari 2024", amount: 75000 },
  { id: 3, name: "Air Januari 2024", amount: 50000 },
]

const mockMembers = [
  { id: 1, name: "Andi Setiawan", email: "andi@example.com" },
  { id: 2, name: "Sari Rahayu", email: "sari@example.com" },
  { id: 3, name: "Budi Pratama", email: "budi@example.com" },
  { id: 4, name: "Dewi Lestari", email: "dewi@example.com" },
]

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const [formData, setFormData] = useState({
    type: "existing", // existing or manual
    dueId: "",
    members: [] as string[],
    customAmount: "",
    customDescription: "",
    dueDate: "",
    notes: "",
    sendEmail: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSuccess(true)
    setIsLoading(false)

    // Reset form after success
    setTimeout(() => {
      setFormData({
        type: "existing",
        dueId: "",
        members: [],
        customAmount: "",
        customDescription: "",
        dueDate: "",
        notes: "",
        sendEmail: true,
      })
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }))
  }

  const selectedDue = mockDues.find((d) => d.id.toString() === formData.dueId)
  const selectedMembers = mockMembers.filter((m) => formData.members.includes(m.id.toString()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Invoice Baru</DialogTitle>
          <DialogDescription>Buat invoice untuk iuran yang sudah ada atau buat invoice manual.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Invoice Berhasil Dibuat!</h3>
            <p className="text-muted-foreground">
              {formData.members.length} invoice telah dibuat dan
              {formData.sendEmail ? " dikirim via email" : " disimpan sebagai draft"}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Type */}
            <div className="space-y-3">
              <Label>Jenis Invoice</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="existing"
                    name="type"
                    value="existing"
                    checked={formData.type === "existing"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="existing">Dari Iuran yang Ada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="manual"
                    name="type"
                    value="manual"
                    checked={formData.type === "manual"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="manual">Invoice Manual</Label>
                </div>
              </div>
            </div>

            {/* Existing Due Selection */}
            {formData.type === "existing" && (
              <div className="space-y-2">
                <Label htmlFor="dueId">Pilih Iuran *</Label>
                <Select
                  value={formData.dueId}
                  onValueChange={(value) => handleChange("dueId", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih iuran" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDues.map((due) => (
                      <SelectItem key={due.id} value={due.id.toString()}>
                        {due.name} - Rp {due.amount.toLocaleString("id-ID")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Manual Invoice Fields */}
            {formData.type === "manual" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customAmount">Jumlah (Rp) *</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="100000"
                      value={formData.customAmount}
                      onChange={(e) => handleChange("customAmount", e.target.value)}
                      disabled={isLoading}
                      required={formData.type === "manual"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Jatuh Tempo *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleChange("dueDate", e.target.value)}
                      disabled={isLoading}
                      required={formData.type === "manual"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDescription">Deskripsi *</Label>
                  <Input
                    id="customDescription"
                    placeholder="Contoh: Pembayaran sewa bulanan"
                    value={formData.customDescription}
                    onChange={(e) => handleChange("customDescription", e.target.value)}
                    disabled={isLoading}
                    required={formData.type === "manual"}
                  />
                </div>
              </>
            )}

            {/* Member Selection */}
            <div className="space-y-3">
              <Label>Pilih Anggota *</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={formData.members.includes(member.id.toString())}
                      onCheckedChange={() => handleMemberToggle(member.id.toString())}
                      disabled={isLoading}
                    />
                    <Label htmlFor={`member-${member.id}`} className="text-sm">
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleChange(
                      "members",
                      mockMembers.map((m) => m.id.toString()),
                    )
                  }
                  disabled={isLoading}
                >
                  Pilih Semua
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange("members", [])}
                  disabled={isLoading}
                >
                  Hapus Semua
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan untuk anggota..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            {/* Send Email Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) => handleChange("sendEmail", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="sendEmail">Kirim invoice via email secara otomatis</Label>
            </div>

            {/* Summary */}
            {(formData.dueId || formData.customAmount) && formData.members.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Ringkasan Invoice:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Item:</span>{" "}
                    {formData.type === "existing" ? selectedDue?.name : formData.customDescription}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Jumlah per invoice:</span> Rp{" "}
                    {(formData.type === "existing"
                      ? selectedDue?.amount ?? 0
                      : Number.parseInt(formData.customAmount || "0")
                    ).toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Jumlah anggota:</span> {formData.members.length}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Total nilai:</span> Rp{" "}
                    {(
                      (formData.type === "existing"
                        ? selectedDue?.amount || 0
                        : Number.parseInt(formData.customAmount || "0")) * formData.members.length
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  formData.members.length === 0 ||
                  (formData.type === "existing" && !formData.dueId) ||
                  (formData.type === "manual" &&
                    (!formData.customAmount || !formData.customDescription || !formData.dueDate))
                }
              >
                {isLoading ? "Membuat..." : `Buat ${formData.members.length} Invoice`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
