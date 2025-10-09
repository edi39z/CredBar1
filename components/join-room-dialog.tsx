/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Users, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface JoinRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock room data for invitation codes
const mockInviteRooms = {
  ABC123: {
    name: "Kos Melati",
    type: "Kos-kosan",
    admin: "Budi Santoso",
    members: 6,
    description: "Kos putri di daerah kampus",
  },
  XYZ789: {
    name: "Arisan RT 05",
    type: "Arisan",
    admin: "Ibu Sari",
    members: 20,
    description: "Arisan bulanan warga RT 05",
  },
}

export function JoinRoomDialog({ open, onOpenChange }: JoinRoomDialogProps) {
  const [inviteCode, setInviteCode] = useState("")
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleCheckCode = async () => {
    if (!inviteCode.trim()) {
      setError("Masukkan kode undangan")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const room = mockInviteRooms[inviteCode.toUpperCase() as keyof typeof mockInviteRooms]
    if (room) {
      setRoomInfo(room)
    } else {
      setError("Kode undangan tidak valid")
    }

    setIsLoading(false)
  }

  const handleJoinRoom = async () => {
    setIsLoading(true)

    // Simulate joining room
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setIsLoading(false)

    // Reset after success
    setTimeout(() => {
      setInviteCode("")
      setRoomInfo(null)
      setSuccess(false)
      setError("")
      onOpenChange(false)
    }, 2000)
  }

  const handleClose = () => {
    setInviteCode("")
    setRoomInfo(null)
    setSuccess(false)
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-card border-2 border-border shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#2563eb]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Gabung Room</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Masukkan kode undangan untuk bergabung dengan room yang sudah ada.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Berhasil Bergabung!</h3>
            <p className="text-muted-foreground">Anda sekarang menjadi anggota "{roomInfo?.name}".</p>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {error && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Card className="border-2 border-[#2563eb]/30 bg-[#2563eb]/5 shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <Label htmlFor="inviteCode" className="text-foreground font-semibold text-base">
                  Kode Undangan
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="inviteCode"
                    placeholder="CONTOH: ABC123"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    className="uppercase font-mono text-lg bg-white dark:bg-card border-2 border-border focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                  />
                  <Button
                    type="button"
                    onClick={handleCheckCode}
                    disabled={isLoading || !inviteCode.trim()}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md px-6 font-semibold"
                  >
                    {isLoading ? "Cek..." : "Cek"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kode undangan biasanya terdiri dari 6 karakter (huruf dan angka)
                </p>
              </CardContent>
            </Card>

            {roomInfo && (
              <Card className="border-2 border-accent/30 bg-accent/5 shadow-md">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                    <h4 className="font-bold text-lg text-foreground">{roomInfo.name}</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-card border border-border">
                      <MapPin className="h-4 w-4 text-[#2563eb] flex-shrink-0" />
                      <span className="font-medium text-foreground">{roomInfo.type}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-card border border-border">
                      <Users className="h-4 w-4 text-[#2563eb] flex-shrink-0" />
                      <span className="font-medium text-foreground">{roomInfo.members} anggota</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-card border-2 border-border">
                      <p className="text-muted-foreground mb-2">{roomInfo.description}</p>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">Admin:</span>{" "}
                        <span className="text-[#2563eb] font-medium">{roomInfo.admin}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center p-4 rounded-lg bg-muted/50 border-2 border-border">
              <p className="text-sm font-medium text-foreground mb-3">Coba kode demo:</p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteCode("ABC123")}
                  disabled={isLoading}
                  className="border-2 border-[#2563eb]/50 hover:border-[#2563eb] hover:bg-[#2563eb]/10 font-mono text-[#2563eb] font-semibold"
                >
                  ABC123
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteCode("XYZ789")}
                  disabled={isLoading}
                  className="border-2 border-[#2563eb]/50 hover:border-[#2563eb] hover:bg-[#2563eb]/10 font-mono text-[#2563eb] font-semibold"
                >
                  XYZ789
                </Button>
              </div>
            </div>
          </div>
        )}

        {!success && (
          <DialogFooter className="gap-2 pt-4 border-t-2 border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-2 border-border hover:bg-muted font-semibold bg-transparent"
            >
              Batal
            </Button>
            {roomInfo && (
              <Button
                onClick={handleJoinRoom}
                disabled={isLoading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md font-semibold"
              >
                {isLoading ? "Bergabung..." : "Gabung Room"}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
