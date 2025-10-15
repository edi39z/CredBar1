"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Semua field harus diisi")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Format email tidak valid")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.message || "Gagal mendaftar")
      } else {
        setSuccess("Akun berhasil dibuat! Silakan login.")
        setFormData({ firstName: "", lastName: "", email: "", password: "" })
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/30 text-white shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 border border-white/20 w-fit mx-auto">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Image src="/logo.png" alt="Logo CredBar" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-bold text-xl font-[family-name:var(--font-poppins)]">CredBar</span>
        </div>
        <CardTitle className="text-2xl font-semibold">Buat Akun</CardTitle>
        <CardDescription className="text-white/80">Daftar untuk memulai perjalanan keuangan Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-[#FF6B6B]/15 border border-[#FF6B6B]/50 text-[#FF6B6B]">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-white/10 border border-white/30 text-white">
              <CheckCircle className="h-4 w-4 text-white" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white font-medium">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-12 pl-12 bg-white/15 border border-white/40 text-white placeholder:text-white/60 backdrop-blur-md rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white font-medium">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-12 pl-12 bg-white/15 border border-white/40 text-white placeholder:text-white/60 backdrop-blur-md rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="h-12 pl-12 bg-white/15 border border-white/40 text-white placeholder:text-white/60 backdrop-blur-md rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-12 pl-12 pr-12 bg-white/15 border border-white/40 text-white placeholder:text-white/60 backdrop-blur-md rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-white/25 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Mendaftar..." : "Create Account"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/80">Atau daftar dengan</span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="glass-outline"
            className="w-full h-12 bg-white/15 border border-white/40 hover:bg-white/25 text-white font-medium rounded-xl"
            disabled={isLoading}
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <div className="text-center">
          <span className="text-sm text-white/80">Sudah punya akun? </span>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/90 underline decoration-white/50 underline-offset-4
        transition-all duration-300 ease-in-out
        hover:text-white hover:decoration-white
        hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
        active:scale-95"
          >
            Login Sekarang
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
