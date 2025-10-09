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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle } from "lucide-react"

interface CreateDebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock members data
const mockMembers = [
  { id: 1, name: "Andi Setiawan", avatar: "AS" },
  { id: 2, name: "Sari Rahayu", avatar: "SR" },
  { id: 3, name: "Budi Pratama", avatar: "BP" },
  { id: 4, name: "Dewi Lestari", avatar: "DL" },
  { id: 5, name: "Eko Wijaya", avatar: "EW" },
]

export function CreateDebtDialog({ open, onOpenChange }: CreateDebtDialogProps) {
  const [formData, setFormData] = useState({
    type: "debt", // debt or credit
    member: "",
    amount: "",
    description: "",
    dueDate: "",
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
        type: "debt",
        member: "",
        amount: "",
        description: "",
        dueDate: "",
      })
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedMember = mockMembers.find((m) => m.id.toString() === formData.member)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Catat Hutang & Piutang</DialogTitle>
          <DialogDescription>Catat hutang atau piutang dengan anggota lain dalam room ini.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {formData.type === "debt" ? "Hutang" : "Piutang"} Berhasil Dicatat!
            </h3>
            <p className="text-muted-foreground">
              {formData.type === "debt" ? "Hutang kepada" : "Piutang dari"} {selectedMember?.name} sebesar Rp{" "}
              {Number.parseInt(formData.amount).toLocaleString("id-ID")} telah dicatat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Jenis Transaksi</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                className="flex space-x-6"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debt" id="debt" />
                  <Label htmlFor="debt" className="text-red-600 font-medium">
                    Saya berhutang
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="text-blue-600 font-medium">
                    Saya berpiutang
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member">{formData.type === "debt" ? "Kepada Siapa" : "Dari Siapa"} *</Label>
              <Select
                value={formData.member}
                onValueChange={(value) => handleChange("member", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {mockMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="50000"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Jatuh Tempo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Keterangan</Label>
              <Textarea
                id="description"
                placeholder="Untuk apa hutang/piutang ini..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            {formData.member && formData.amount && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Ringkasan:</p>
                <p className="font-medium">
                  {formData.type === "debt" ? "Anda berhutang kepada" : "Anda berpiutang dari"}{" "}
                  <span className="text-primary">{selectedMember?.name}</span> sebesar{" "}
                  <span className={formData.type === "debt" ? "text-red-600" : "text-blue-600"}>
                    Rp {Number.parseInt(formData.amount || "0").toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="glass-outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.member || !formData.amount}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
