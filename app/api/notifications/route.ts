import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuthToken } from "@/lib/auth"

// Ambil Notifikasi
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = await verifyAuthToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const userId = Number(payload.sub)

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    // Mapping Enum DB ke Tipe UI
    const mappedNotifications = notifications.map((n) => {
      let type: "info" | "warning" | "success" = "info"
      
      if (n.type === "PAYMENT_DUE") type = "info"
      if (n.type === "PAYMENT_OVERDUE") type = "warning"
      if (n.title.toLowerCase().includes("diterima") || n.type === "INVOICE_SENT") type = "success"
      if (n.title.toLowerCase().includes("ditolak")) type = "warning"

      return {
        id: n.id.toString(),
        tipe: type,
        judul: n.title,
        pesan: n.message,
        tanggal: n.createdAt.toISOString(),
        dibaca: n.isRead,
      }
    })

    return NextResponse.json(mappedNotifications)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Hapus Notifikasi
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

  await prisma.notification.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}