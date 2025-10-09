import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
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
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/20 via-transparent to-blue-400/10" />

        {/* Content */}
        <div className="relative z-10 text-center text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold mb-2 font-[family-name:var(--font-poppins)] text-balance">
              Welcome To CredBar
            </h1>
            <p className="text-xl text-blue-100 max-w-md mx-auto text-pretty">
              Bergabunglah dengan ribuan pengguna yang sudah mempercayai CredBar
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
