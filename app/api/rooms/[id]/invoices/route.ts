import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invoices = await prisma.invoice.findMany({
      where: { roomId: Number.parseInt(id) },
      include: {
        member: true,
        payments: true,
        due: true,
      },
    })

    return NextResponse.json({ success: true, data: invoices })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { memberId, dueId, description, amount, dueDate } = body

    // Generate invoice code
    const count = await prisma.invoice.count({
      where: { roomId: Number.parseInt(id) },
    })
    const code = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const invoice = await prisma.invoice.create({
      data: {
        code,
        roomId: Number.parseInt(id),
        memberId,
        dueId: dueId || undefined,
        description,
        amount,
        dueDate: new Date(dueDate),
        status: "PENDING",
      },
      include: {
        member: true,
        payments: true,
      },
    })

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create invoice" }, { status: 500 })
  }
}
