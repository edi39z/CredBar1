import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; dueId: string; invoiceId: string }> },
) {
  try {
    const { id, dueId, invoiceId } = await params
    const roomId = Number(id)
    const dueIdNum = Number(dueId)

    if (isNaN(roomId) || isNaN(dueIdNum)) {
      return NextResponse.json({ success: false, message: "Invalid IDs" }, { status: 400 })
    }

    // Check if due exists
    const due = await prisma.due.findUnique({
      where: { id: dueIdNum },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    // Check if invoice exists and belongs to this due
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice || invoice.dueId !== dueIdNum) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 })
    }

    // Delete payments associated with invoice
    await prisma.payment.deleteMany({
      where: { invoiceId },
    })

    // Delete the invoice
    await prisma.invoice.delete({
      where: { id: invoiceId },
    })

    return NextResponse.json({
      success: true,
      message: "Anggota berhasil dihapus dari iuran",
    })
  } catch (error) {
    console.error("Error removing member from due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
