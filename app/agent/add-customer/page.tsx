import { AgentSidebar } from "@/components/agent-sidebar"
import { AddCustomerForm } from "@/components/add-customer-form"

export default function AddCustomerPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AgentSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tambah Nasabah Baru</h1>
            <p className="text-muted-foreground">Lengkapi formulir di bawah ini untuk menambahkan nasabah baru.</p>
          </div>

          <AddCustomerForm />
        </div>
      </main>
    </div>
  )
}
