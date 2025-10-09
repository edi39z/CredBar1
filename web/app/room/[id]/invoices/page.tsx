import { InvoiceManagement } from "@/components/invoice-management";

export default function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  return <InvoiceManagement roomId={params.id} />;
}
