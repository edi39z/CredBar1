// /app/api/dues/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dues = await prisma.due.findMany({ orderBy: { nextDueDate: "asc" } });
    return NextResponse.json(dues);
  } catch (err) {
    console.error("GET dues:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected: { roomId, name, amount, isRecurring?, frequency?, interval?, startDate? }
    if (!body.roomId || !body.name || !body.amount) {
      return NextResponse.json({ error: "roomId, name, amount required" }, { status: 400 });
    }
    const due = await prisma.due.create({
      data: {
        roomId: body.roomId,
        name: body.name,
        description: body.description ?? null,
        amount: Number(body.amount),
        isRecurring: !!body.isRecurring,
        frequency: body.frequency ?? null,
        interval: body.interval ?? null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        isActive: body.isActive !== undefined ? !!body.isActive : true,
      },
    });
    return NextResponse.json(due, { status: 201 });
  } catch (err) {
    console.error("POST due:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
