import { LoginForm } from "@/components/login-form"
import { CreditCard, Shield, TrendingUp } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle grid pattern texture */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-blue-400/10" />

        {/* Content */}
        <div className="relative z-10 text-center text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold mb-2 font-[family-name:var(--font-poppins)] text-balance">
              Selamat Datang di CredBar
            </h1>
            <p className="text-xl text-blue-100 max-w-md mx-auto text-pretty">
              Kelola keuangan dan kredit Anda dengan mudah, aman, dan profesional
            </p>
          </div>

          {/* Feature icons */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <CreditCard className="w-8 h-8 text-blue-200" />
              </div>
              <span className="text-sm text-blue-200 font-medium">Manajemen Kredit</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <Shield className="w-8 h-8 text-blue-200" />
              </div>
              <span className="text-sm text-blue-200 font-medium">Keamanan Terjamin</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
              <span className="text-sm text-blue-200 font-medium">Laporan Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
