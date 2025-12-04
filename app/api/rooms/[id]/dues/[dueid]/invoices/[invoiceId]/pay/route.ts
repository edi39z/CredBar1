import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function safeJson(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  )
}

export async function POST(
  req: NextRequest,
  // 1. Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string; dueId: string; invoiceId: string }> }
) {
  try {
    // 2. Lakukan await pada params
    const { id, dueId, invoiceId } = await params

    const body = await req.json()
    const { amount, method, note } = body

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Nominal pembayaran tidak valid" },
        { status: 400 }
      )
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: "Tagihan tidak ditemukan" },
        { status: 404 }
      )
    }

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      return tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PENDING",
          paymentMethod: method,
          paidDate: new Date(),
          description: note
            ? `${invoice.description || ""} | Note: ${note}`
            : invoice.description,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dikirim. Menunggu konfirmasi admin.",
      data: safeJson(updatedInvoice),
    })

  } catch (error) {
    console.error("Error paying invoice:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}