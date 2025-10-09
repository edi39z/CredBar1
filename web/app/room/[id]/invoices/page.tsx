import { InvoiceManagement } from "@/components/invoice-management"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default function InvoicePage({ params }: InvoicePageProps) {
  return <InvoiceManagement roomId={params.id} />
}
