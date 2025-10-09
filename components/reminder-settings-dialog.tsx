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
import { Switch } from "@/components/ui/switch"
import { CheckCircle, Clock, Mail, MessageSquare, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ReminderSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReminderSettingsDialog({ open, onOpenChange }: ReminderSettingsDialogProps) {
  const [formData, setFormData] = useState({
    reminderDays: "3",
    reminderTime: "09:00",
    overdueFrequency: "weekly",
    emailEnabled: true,
    smsEnabled: false,
    customMessage: "",
    autoReminder: true,
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

    // Reset after success
    setTimeout(() => {
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white dark:bg-card border-2 border-border shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#2563eb]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Pengaturan Pengingat</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Atur kapan dan bagaimana pengingat dikirim kepada anggota.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Pengaturan Berhasil Disimpan!</h3>
            <p className="text-muted-foreground">Pengaturan pengingat telah diperbarui.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Card className="border-2 border-[#2563eb]/30 bg-[#2563eb]/5 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-[#2563eb]" />
                  <h4 className="font-semibold text-foreground">Waktu Pengingat</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderDays" className="text-foreground font-medium">
                      Hari Sebelum Jatuh Tempo
                    </Label>
                    <Select
                      value={formData.reminderDays}
                      onValueChange={(value) => handleChange("reminderDays", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-white dark:bg-card border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hari</SelectItem>
                        <SelectItem value="2">2 hari</SelectItem>
                        <SelectItem value="3">3 hari</SelectItem>
                        <SelectItem value="5">5 hari</SelectItem>
                        <SelectItem value="7">7 hari</SelectItem>
                        <SelectItem value="14">14 hari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderTime" className="text-foreground font-medium">
                      Waktu Pengiriman
                    </Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={formData.reminderTime}
                      onChange={(e) => handleChange("reminderTime", e.target.value)}
                      disabled={isLoading}
                      className="bg-white dark:bg-card border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-warning/30 bg-warning/5 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5 text-warning" />
                  <h4 className="font-semibold text-foreground">Pengingat Terlambat</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overdueFrequency" className="text-foreground font-medium">
                    Frekuensi Pengingat
                  </Label>
                  <Select
                    value={formData.overdueFrequency}
                    onValueChange={(value) => handleChange("overdueFrequency", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-white dark:bg-card border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="biweekly">2 Minggu Sekali</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#2563eb]/30 bg-[#2563eb]/5 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-[#2563eb]" />
                  <h4 className="font-semibold text-foreground">Metode Notifikasi</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-card border-2 border-border hover:border-[#2563eb]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#2563eb]" />
                      </div>
                      <div>
                        <Label htmlFor="emailEnabled" className="text-foreground font-medium cursor-pointer">
                          Email
                        </Label>
                        <p className="text-sm text-muted-foreground">Kirim pengingat via email</p>
                      </div>
                    </div>
                    <Switch
                      id="emailEnabled"
                      checked={formData.emailEnabled}
                      onCheckedChange={(checked) => handleChange("emailEnabled", checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-card border-2 border-border hover:border-[#2563eb]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-[#2563eb]" />
                      </div>
                      <div>
                        <Label htmlFor="smsEnabled" className="text-foreground font-medium cursor-pointer">
                          SMS
                        </Label>
                        <p className="text-sm text-muted-foreground">Kirim pengingat via SMS</p>
                      </div>
                    </div>
                    <Switch
                      id="smsEnabled"
                      checked={formData.smsEnabled}
                      onCheckedChange={(checked) => handleChange("smsEnabled", checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border-2 border-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <Label htmlFor="autoReminder" className="text-foreground font-medium cursor-pointer">
                    Pengingat Otomatis
                  </Label>
                  <p className="text-sm text-muted-foreground">Kirim pengingat secara otomatis</p>
                </div>
              </div>
              <Switch
                id="autoReminder"
                checked={formData.autoReminder}
                onCheckedChange={(checked) => handleChange("autoReminder", checked)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage" className="text-foreground font-medium">
                Pesan Kustom (Opsional)
              </Label>
              <Textarea
                id="customMessage"
                placeholder="Tambahkan pesan khusus untuk pengingat..."
                value={formData.customMessage}
                onChange={(e) => handleChange("customMessage", e.target.value)}
                disabled={isLoading}
                rows={3}
                className="bg-white dark:bg-card border-2 border-border resize-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
              <p className="text-xs text-muted-foreground">Pesan ini akan ditambahkan ke template pengingat default</p>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-2 border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="border-2 border-border hover:bg-muted font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md font-semibold"
              >
                {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
