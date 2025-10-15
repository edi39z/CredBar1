/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"
import { CheckCircle, Home } from "lucide-react"
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

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRoomDialog({ open, onOpenChange }: CreateRoomDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    currency: "IDR",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Gagal membuat room")
      }
      setSuccess(true)
      // TODO: refresh data source (SWR mutate) or redirect
    } catch (err: any) {
      console.log("[v0] create room error:", err.message)
      // You might show alert here
    } finally {
      setIsLoading(false)
    }

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", type: "", description: "", currency: "IDR" })
      setSuccess(false)
      onOpenChange(false)
    }, 1500)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-card border-2 border-[#2563eb]/20 shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <Home className="h-5 w-5 text-[#2563eb]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Buat Room Baru</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Buat room untuk mengelola iuran, hutang, atau keuangan kelompok Anda.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Room Berhasil Dibuat!</h3>
            <p className="text-muted-foreground">Room "{formData.name}" telah dibuat dan siap digunakan.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Room *</Label>
              <Input
                id="name"
                placeholder="Contoh: Kos Mawar, Arisan Keluarga"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
                className="border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
              <p className="text-xs text-muted-foreground">Gunakan nama yang mudah dikenali anggota.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Room *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} disabled={isLoading}>
                <SelectTrigger className="border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20">
                  <SelectValue placeholder="Pilih jenis room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kos">Kos-kosan</SelectItem>
                  <SelectItem value="arisan">Arisan</SelectItem>
                  <SelectItem value="keluarga">Keluarga</SelectItem>
                  <SelectItem value="organisasi">Organisasi</SelectItem>
                  <SelectItem value="olahraga">Tim Olahraga</SelectItem>
                  <SelectItem value="hobi">Komunitas Hobi</SelectItem>
                  <SelectItem value="bisnis">Bisnis Kecil</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Mata Uang</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan tujuan room ini..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
                className="border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-2 border-border">
              <Button
                type="button"
                variant="glass-outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="border-2"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.type}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md"
              >
                {isLoading ? "Membuat..." : "Buat Room"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
