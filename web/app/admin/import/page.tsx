import { AdminSidebar } from "@/components/admin-sidebar"
import { ImportDataForm } from "@/components/import-data-form"

export default function ImportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Import Data Nasabah</h1>
            <p className="text-muted-foreground">Upload file CSV untuk menambahkan data nasabah secara massal.</p>
          </div>

          <ImportDataForm />
        </div>
      </main>
    </div>
  )
}
