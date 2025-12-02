import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; invoiceId: string }> }) {
  try {
    const { invoiceId } = await params
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        member: true,
        payments: true,
        due: true,
        room: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch invoice" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; invoiceId: string }> }) {
  try {
    const { invoiceId } = await params
    const body = await request.json()
    const { status, paymentMethod } = body

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(paymentMethod && { paymentMethod }),
        ...(status === "PAID" && { paidDate: new Date() }),
      },
      include: {
        member: true,
        payments: true,
      },
    })

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; invoiceId: string }> }) {
  try {
    const { invoiceId } = await params

    await prisma.invoice.delete({
      where: { id: invoiceId },
    })

    return NextResponse.json({ success: true, message: "Invoice deleted" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete invoice" }, { status: 500 })
  }
}
