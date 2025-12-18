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

    // 2. Cek apakah invoice ada dan ambil detail untuk notifikasi
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        room: { select: { name: true } },
        due: { select: { name: true } }
      }
    })

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Tagihan tidak ditemukan" }, { status: 404 })
    }

    // 3. Update status menjadi PAID (Lunas)
    // Sekaligus update status di tabel Payment yang terkait agar sinkron
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paidDate: new Date(), // Menandakan tanggal pelunasan resmi
      },
    })

    // UPDATE: Update juga status verifikasi di tabel Payment
    await prisma.payment.updateMany({
      where: { invoiceId: invoiceId },
      data: { status: "VERIFIED" }
    })

    // 4. TRIGGER NOTIFIKASI KE USER (PEMBAYAR)
    try {
      await prisma.notification.create({
        data: {
          userId: invoice.memberId,
          roomId: invoice.roomId,
          type: "INVOICE_SENT", // Menggunakan enum yang tersedia
          title: "Pembayaran Diterima",
          message: `Pembayaran iuran "${invoice.due?.name || 'Iuran'}" di grup ${invoice.room.name} telah dikonfirmasi oleh admin. Status: Lunas.`,
          priority: "NORMAL",
        },
      })
      console.log(`[Notif] Notifikasi konfirmasi pembayaran dikirim ke User ID: ${invoice.memberId}`)
    } catch (notifError) {
      console.error("[Notif] Gagal mengirim notifikasi konfirmasi:", notifError)
    }

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