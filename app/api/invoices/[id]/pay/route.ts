// /app/api/invoices/[id]/pay/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    const body = await req.json();
    // expected: { amount, method, createdById, note? }
    if (!body.amount || !body.method || !body.createdById) {
      return NextResponse.json({ error: "amount, method, createdById required" }, { status: 400 });
    }

    // ensure invoice exists
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    // create payment record
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amount: Number(body.amount),
        method: body.method,
        note: body.note ?? null,
        createdById: Number(body.createdById),
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      },
    });

    // update invoice status -> if total paid >= invoice.amount => PAID, else keep PENDING
    // calculate total paid
    const agg = await prisma.payment.aggregate({
      where: { invoiceId },
      _sum: { amount: true },
    });
    const totalPaid = (agg._sum.amount ?? 0);

    let newStatus = invoice.status;
    const paidDate = totalPaid >= invoice.amount ? new Date() : null;

    if (totalPaid >= invoice.amount) newStatus = "PAID";
    else newStatus = "PENDING";

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus, paidDate: paidDate ?? undefined },
    });

    return NextResponse.json({ payment, invoiceStatus: newStatus });
  } catch (err) {
    console.error("POST pay invoice:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
