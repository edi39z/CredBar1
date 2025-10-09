/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, CheckCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  job: string
  income: string
}

interface FormErrors {
  [key: string]: string
}

export function AddCustomerForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    job: "",
    income: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi"
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor HP harus diisi"
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Format nomor HP tidak valid"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat harus diisi"
    }

    if (!formData.job.trim()) {
      newErrors.job = "Pekerjaan harus diisi"
    }

    if (!formData.income.trim()) {
      newErrors.income = "Penghasilan harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful submission
      console.log("Customer data submitted:", formData)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          job: "",
          income: "",
        })
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan saat menyimpan data" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Data Berhasil Disimpan!</h3>
        <p className="text-muted-foreground mb-4">
          Data nasabah <strong>{formData.name}</strong> telah berhasil ditambahkan dan sedang menunggu validasi admin.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Tambah Nasabah Lain</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <Alert variant="destructive">
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Masukkan alamat email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor HP *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="Masukkan nomor HP"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        {/* Job */}
        <div className="space-y-2">
          <Label htmlFor="job">Pekerjaan *</Label>
          <Select value={formData.job} onValueChange={(value) => handleInputChange("job", value)}>
            <SelectTrigger>
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih pekerjaan" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="karyawan-swasta">Karyawan Swasta</SelectItem>
              <SelectItem value="pns">PNS</SelectItem>
              <SelectItem value="wiraswasta">Wiraswasta</SelectItem>
              <SelectItem value="guru">Guru</SelectItem>
              <SelectItem value="dokter">Dokter</SelectItem>
              <SelectItem value="pengacara">Pengacara</SelectItem>
              <SelectItem value="insinyur">Insinyur</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {errors.job && <p className="text-sm text-destructive">{errors.job}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Alamat Lengkap *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="address"
            placeholder="Masukkan alamat lengkap"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="pl-10 min-h-[100px]"
            disabled={isLoading}
          />
        </div>
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      {/* Income */}
      <div className="space-y-2">
        <Label htmlFor="income">Penghasilan per Bulan *</Label>
        <Select value={formData.income} onValueChange={(value) => handleInputChange("income", value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Pilih range penghasilan" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="< 3.000.000">{"< Rp 3.000.000"}</SelectItem>
            <SelectItem value="3.000.000 - 5.000.000">Rp 3.000.000 - Rp 5.000.000</SelectItem>
            <SelectItem value="5.000.000 - 10.000.000">Rp 5.000.000 - Rp 10.000.000</SelectItem>
            <SelectItem value="10.000.000 - 20.000.000">Rp 10.000.000 - Rp 20.000.000</SelectItem>
            <SelectItem value="> 20.000.000">{"> Rp 20.000.000"}</SelectItem>
          </SelectContent>
        </Select>
        {errors.income && <p className="text-sm text-destructive">{errors.income}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Data Nasabah"}
        </Button>
        <Button
          type="button"
          variant="glass-outline"
          className="flex-1 bg-transparent"
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              job: "",
              income: "",
            })
            setErrors({})
          }}
          disabled={isLoading}
        >
          Reset Form
        </Button>
      </div>
    </form>
  )
}
