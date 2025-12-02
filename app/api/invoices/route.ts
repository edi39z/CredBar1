// /app/api/invoices/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");
    const memberId = url.searchParams.get("memberId");

    const where: any = {};
    if (roomId) where.roomId = Number(roomId);
    if (memberId) where.memberId = Number(memberId);

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { room: { select: { name: true } }, member: { select: { name: true } }, payments: true },
      take: 100,
    });
    return NextResponse.json(invoices);
  } catch (err) {
    console.error("GET invoices:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected: { roomId, memberId, dueId?, description?, amount, dueDate, paymentMethod? }
    const required = ["roomId", "memberId", "amount", "dueDate"];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }

    // create invoice code simple generator (improve later)
    const seq = Math.floor(Math.random() * 9000) + 1000;
    const code = `INV-${new Date().getFullYear()}-${seq}`;

    const invoice = await prisma.invoice.create({
      data: {
        code,
        roomId: Number(body.roomId),
        memberId: Number(body.memberId),
        dueId: body.dueId ?? null,
        description: body.description ?? null,
        amount: Number(body.amount),
        status: body.status ?? "PENDING",
        dueDate: new Date(body.dueDate),
        paymentMethod: body.paymentMethod ?? null,
        sentAt: body.sentAt ? new Date(body.sentAt) : null,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error("POST invoice:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
