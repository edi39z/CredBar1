// /app/api/dashboard/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1) Total rooms
    const totalGroups = await prisma.room.count();

    // 2) Unpaid amount (PENDING invoices)
    const unpaid = await prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "PENDING" },
    });

    // 3) recent payments (last 30 days) grouped by day for progress chart (simple)
    const since = new Date();
    since.setDate(since.getDate() - 29); // 30 days window

    const payments = await prisma.payment.findMany({
      where: { paidAt: { gte: since } },
      select: {
        id: true,
        amount: true,
        paidAt: true,
        invoice: {
          select: {
            code: true,
            room: { select: { id: true, name: true } },
            member: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      orderBy: { paidAt: "asc" },
    });

    // map to simple daily series
    const paymentProgressData = payments.map((p) => ({
      id: p.id,
      date: p.paidAt,
      amount: p.amount,
      invoiceCode: p.invoice.code,
      roomName: p.invoice.room?.name ?? null,
      memberName: p.invoice.member?.name ?? null,
    }));

    // 4) breakdown by Due
    const dues = await prisma.due.findMany({
      select: { id: true, name: true, amount: true, roomId: true, isActive: true },
      orderBy: { amount: "desc" },
      take: 50,
    });

    const breakdown = dues.map((d) => ({ id: d.id, name: d.name, amount: d.amount, roomId: d.roomId, isActive: d.isActive }));

    // 5) transaction history (latest 10)
    const transactions = await prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        paidAt: true,
        invoice: {
          select: {
            code: true,
            room: { select: { name: true } },
            member: { select: { name: true } },
            status: true,
          },
        },
      },
    });

    const mappedTx = transactions.map((t) => ({
      id: t.id,
      name: t.invoice.member?.name ?? "Unknown",
      group: t.invoice.room?.name ?? "Unknown",
      amount: t.amount,
      date: t.paidAt,
      status: t.invoice.status === "PAID" ? "Lunas" : "Menunggu",
      invoiceCode: t.invoice.code,
    }));

    return NextResponse.json({
      totalGroups,
      unpaidAmount: unpaid._sum.amount ?? 0,
      paymentProgressData,
      breakdown,
      transactions: mappedTx,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
