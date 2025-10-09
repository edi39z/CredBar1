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
import { Switch } from "@/components/ui/switch"
import { CheckCircle } from "lucide-react"

interface CreateDuesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDuesDialog({ open, onOpenChange }: CreateDuesDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    frequency: "",
    dueDate: "",
    isRecurring: false,
    reminderDays: "3",
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
        name: "",
        amount: "",
        description: "",
        frequency: "",
        dueDate: "",
        isRecurring: false,
        reminderDays: "3",
      })
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Iuran Baru</DialogTitle>
          <DialogDescription>Buat iuran untuk anggota room. Iuran dapat berulang secara otomatis.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Iuran Berhasil Dibuat!</h3>
            <p className="text-muted-foreground">
              Iuran {formData.name} telah dibuat dan akan dikirim ke semua anggota.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Iuran *</Label>
              <Input
                id="name"
                placeholder="Contoh: Listrik Bulan Januari, WiFi, Air"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="150000"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  disabled={isLoading}
                  required
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan detail iuran ini..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleChange("isRecurring", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="recurring">Iuran berulang</Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="frequency">Frekuensi Pengulangan</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => handleChange("frequency", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="quarterly">3 Bulan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reminderDays">Pengingat (hari sebelum jatuh tempo)</Label>
              <Select
                value={formData.reminderDays}
                onValueChange={(value) => handleChange("reminderDays", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hari</SelectItem>
                  <SelectItem value="3">3 hari</SelectItem>
                  <SelectItem value="7">7 hari</SelectItem>
                  <SelectItem value="14">14 hari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.amount || !formData.dueDate}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Membuat..." : "Buat Iuran"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
