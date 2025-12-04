import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Helper untuk menangani BigInt saat respon JSON
function safeJson(data: any) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; dueId: string; invoiceId: string }> }
) {
  try {
    // 1. Await params (Wajib di Next.js 15)
    const { id, dueId, invoiceId } = await params
    
    // Validasi ID sederhana
    if (!invoiceId) {
      return NextResponse.json({ success: false, message: "Invoice ID tidak valid" }, { status: 400 })
    }

    // 2. Cek apakah invoice ada
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Tagihan tidak ditemukan" }, { status: 404 })
    }

    // 3. Update status menjadi PAID (Lunas)
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        // Opsional: update paidDate ke waktu sekarang jika belum ada
        // paidDate: invoice.paidDate ? invoice.paidDate : new Date() 
      },
    })

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dikonfirmasi!",
      data: safeJson(updatedInvoice),
    })

  } catch (error) {
    console.error("Error confirming invoice:", error)
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}