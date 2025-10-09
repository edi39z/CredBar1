import { AdminSidebar } from "@/components/admin-sidebar"
import { ReportsOverview } from "@/components/reports-overview"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Laporan & Analisis</h1>
            <p className="text-muted-foreground">Lihat laporan komprehensif dan analisis data nasabah.</p>
          </div>

          <ReportsOverview />
        </div>
      </main>
    </div>
  )
}
