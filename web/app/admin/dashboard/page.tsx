import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminOverview } from "@/components/admin-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock, FileText, Upload } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">Kelola dan validasi data nasabah dari seluruh agen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Nasabah</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">1,247</div>
                <p className="text-xs text-muted-foreground mt-1">+18% dari bulan lalu</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Valid</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">1,089</div>
                <p className="text-xs text-muted-foreground mt-1">87% dari total</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">127</div>
                <p className="text-xs text-muted-foreground mt-1">Menunggu validasi</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Invalid</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">31</div>
                <p className="text-xs text-muted-foreground mt-1">2.5% dari total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  Validasi Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review dan validasi data nasabah yang baru ditambahkan oleh agen.
                </p>
                <a
                  href="/admin/validation"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Mulai Validasi →
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-secondary cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mr-3">
                    <Upload className="h-5 w-5 text-secondary" />
                  </div>
                  Import Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload file CSV untuk menambahkan data nasabah secara massal.
                </p>
                <a
                  href="/admin/import"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Upload File →
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-accent cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  Laporan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Lihat laporan dan analisis data nasabah dengan grafik dan tabel.
                </p>
                <a
                  href="/admin/reports"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Lihat Laporan →
                </a>
              </CardContent>
            </Card>
          </div>

          <AdminOverview />
        </div>
      </main>
    </div>
  )
}
