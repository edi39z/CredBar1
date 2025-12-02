import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; invoiceId: string }> }) {
  try {
    const { invoiceId } = await params
    const body = await request.json()
    const { amount, method, note, createdById } = body

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        note,
        createdById,
      },
      include: {
        invoice: {
          include: {
            member: true,
          },
        },
      },
    })

    // Update invoice status if fully paid
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payments: true,
      },
    })

    const totalPaid = invoice?.payments.reduce((sum, p) => sum + p.amount, 0) || 0
    if (totalPaid >= (invoice?.amount || 0)) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paidDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create payment" }, { status: 500 })
  }
}
