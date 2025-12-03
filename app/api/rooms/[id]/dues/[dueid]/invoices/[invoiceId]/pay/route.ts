import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Helper untuk BigInt
function safeJson(data: any) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; dueId: string; invoiceId: string }> }
) {
  try {
    const { id, dueId, invoiceId } = await params // Await params (Next.js 15)
    
    // Validasi input body
    const body = await req.json()
    const { amount, method, note } = body

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, message: "Nominal pembayaran tidak valid" }, { status: 400 })
    }

    // 1. Cek apakah Invoice ada
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Tagihan tidak ditemukan" }, { status: 404 })
    }

    // 2. Update Invoice menjadi PENDING (Menunggu Konfirmasi Admin)
    // Sekaligus catat history pembayaran jika Anda punya tabel Payment (Opsional, di sini kita update invoice dulu)
    
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // a. Update status invoice
      const inv = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PENDING", // Ubah jadi PENDING agar Admin bisa konfirmasi nanti
          paymentMethod: method,
          paidDate: new Date(), // Tanggal user klik bayar
          description: note ? `${invoice.description || ""} | Note: ${note}` : invoice.description
        }
      })

      // b. (Opsional) Jika Anda punya tabel 'Payment', buat record baru di sini
      // await tx.payment.create({ ... })

      return inv
    })

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil dikirim. Menunggu konfirmasi admin.",
      data: safeJson(updatedInvoice),
    })

  } catch (error) {
    console.error("Error paying invoice:", error)
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}