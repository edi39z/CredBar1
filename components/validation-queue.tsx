"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  job: string
  income: string
  agent: string
  createdAt: string
  status: "pending"
}

const mockPendingCustomers: Customer[] = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@email.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
    job: "Karyawan Swasta",
    income: "Rp 8.000.000 - Rp 10.000.000",
    agent: "Siti Agent",
    createdAt: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    phone: "081234567891",
    address: "Jl. Gatot Subroto No. 456, Bandung, Jawa Barat 40123",
    job: "Guru",
    income: "Rp 5.000.000 - Rp 8.000.000",
    agent: "Budi Agent",
    createdAt: "2024-01-14",
    status: "pending",
  },
  {
    id: 3,
    name: "Rudi Hermawan",
    email: "rudi.hermawan@email.com",
    phone: "081234567892",
    address: "Jl. Diponegoro No. 789, Surabaya, Jawa Timur 60234",
    job: "Dokter",
    income: "> Rp 20.000.000",
    agent: "Ani Agent",
    createdAt: "2024-01-13",
    status: "pending",
  },
]

export function ValidationQueue() {
  const [customers, setCustomers] = useState<Customer[]>(mockPendingCustomers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const currentCustomer = customers[currentIndex]

  const handleApprove = async () => {
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Remove current customer from queue
    const updatedCustomers = customers.filter((_, index) => index !== currentIndex)
    setCustomers(updatedCustomers)

    // Adjust current index if needed
    if (currentIndex >= updatedCustomers.length && updatedCustomers.length > 0) {
      setCurrentIndex(updatedCustomers.length - 1)
    } else if (updatedCustomers.length === 0) {
      setCurrentIndex(0)
    }

    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Remove current customer from queue
    const updatedCustomers = customers.filter((_, index) => index !== currentIndex)
    setCustomers(updatedCustomers)

    // Adjust current index if needed
    if (currentIndex >= updatedCustomers.length && updatedCustomers.length > 0) {
      setCurrentIndex(updatedCustomers.length - 1)
    } else if (updatedCustomers.length === 0) {
      setCurrentIndex(0)
    }

    setRejectionReason("")
    setShowRejectDialog(false)
    setIsProcessing(false)
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < customers.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Check className="mx-auto h-16 w-16 text-success mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Semua Data Telah Divalidasi!</h3>
            <p className="text-muted-foreground">Tidak ada data nasabah yang menunggu validasi saat ini.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                Data {currentIndex + 1} dari {customers.length}
              </span>
            </div>
            <Badge variant="secondary">{customers.length} Pending</Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / customers.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detail Nasabah</span>
            <div className="flex items-center gap-2">
              <Button variant="glass-outline" size="sm" onClick={goToPrevious} disabled={currentIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="glass-outline" size="sm" onClick={goToNext} disabled={currentIndex === customers.length - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-medium">{currentCustomer.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentCustomer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nomor HP</p>
                  <p className="font-medium">{currentCustomer.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pekerjaan</p>
                  <p className="font-medium">{currentCustomer.job}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Penghasilan</p>
                  <p className="font-medium">{currentCustomer.income}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Agen</p>
                  <p className="font-medium">{currentCustomer.agent}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                <p className="font-medium">{currentCustomer.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tanggal Submit:</strong>{" "}
              {new Date(currentCustomer.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <Check className="mr-2 h-4 w-4" />
              {isProcessing ? "Memproses..." : "Setujui (Valid)"}
            </Button>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button variant="glass" disabled={isProcessing} className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  Tolak (Invalid)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tolak Data Nasabah</DialogTitle>
                  <DialogDescription>
                    Berikan alasan penolakan untuk data nasabah <strong>{currentCustomer.name}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Alasan Penolakan *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Masukkan alasan penolakan data..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="glass-outline" onClick={() => setShowRejectDialog(false)}>
                      Batal
                    </Button>
                    <Button
                      variant="glass"
                      onClick={handleReject}
                      disabled={!rejectionReason.trim() || isProcessing}
                    >
                      {isProcessing ? "Memproses..." : "Tolak Data"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Alert className="mt-4">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Pastikan semua data telah diperiksa dengan teliti sebelum memberikan keputusan validasi.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
