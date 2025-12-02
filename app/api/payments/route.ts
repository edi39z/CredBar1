// /app/api/payments/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      take: 100,
      include: {
        invoice: {
          select: { id: true, code: true, room: { select: { name: true } }, member: { select: { id: true, name: true } }, status: true },
        },
        createdBy: { select: { id: true, name: true } },
      },
    });

    const mapped = payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      paidAt: p.paidAt,
      invoiceCode: p.invoice?.code ?? null,
      memberName: p.invoice?.member?.name ?? null,
      groupName: p.invoice?.room?.name ?? null,
      createdBy: p.createdBy?.name ?? null,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET payments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
