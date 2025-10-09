import Image from "next/image"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/BackGroundAuth.png"
          alt="Latar belakang autentikasi CredBar"
          fill
          priority
          className="object-cover"
        />
        {/* subtle overlay for contrast */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left hero copy */}
          <section className="lg:col-span-7 text-white space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance font-[family-name:var(--font-poppins)]">
              Selamat Datang di CredBar
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-xl text-pretty">
              Kelola keuangan kelompokmu dengan mudah, transparan, dan modern. Pantau iuran, cicilan, dan laporan dalam
              satu tempat.
            </p>
          </section>

          {/* Right glass card */}
          <section className="lg:col-span-5">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  )
}
