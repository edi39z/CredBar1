import { InvoiceManagement } from "@/components/invoice-management";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  return <InvoiceManagement roomId={id} />;
}
