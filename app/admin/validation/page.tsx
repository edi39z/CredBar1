import { AdminSidebar } from "@/components/admin-sidebar"
import { ValidationQueue } from "@/components/validation-queue"

export default function ValidationPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Validasi Data Nasabah</h1>
            <p className="text-muted-foreground">Review dan validasi data nasabah yang telah disubmit oleh agen.</p>
          </div>

          <ValidationQueue />
        </div>
      </main>
    </div>
  )
}
