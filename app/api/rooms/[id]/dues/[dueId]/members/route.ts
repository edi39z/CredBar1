import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Helper agar data BigInt bisa dikirim sebagai JSON
function safeJson(data: any) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)))
}

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string; dueId: string }> }
) {
  try {
    const { id, dueId } = await params
    const roomId = Number(id)
    const dueIdNum = Number(dueId)

    // 1. Validasi Parameter URL
    if (isNaN(roomId) || isNaN(dueIdNum)) {
      return NextResponse.json({ success: false, message: "URL Parameter Invalid" }, { status: 400 })
    }

    // 2. Ambil Payload (memberId & amount)
    const body = await req.json()
    // Ini adalah ID dari tabel RoomMember (dikirim frontend)
    const roomMemberId = Number(body.memberId) 
    // Ini adalah nominal manual
    const amount = Number(body.amount)

    console.log("[API DEBUG] Payload:", { roomMemberId, amount, roomId, dueIdNum })

    // 3. Validasi Payload
    if (isNaN(roomMemberId)) {
      return NextResponse.json({ success: false, message: "Member ID tidak valid" }, { status: 400 })
    }
    if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ success: false, message: "Nominal harus diisi dan lebih dari 0" }, { status: 400 })
    }

    // 4. Cek Keberadaan Iuran (Due)
    const due = await prisma.due.findUnique({
      where: { id: dueIdNum },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Data Iuran tidak ditemukan" }, { status: 404 })
    }

    // 5. [STEP PENTING] Konversi RoomMember ID -> User ID
    // Frontend mengirim ID RoomMember, tapi Invoice butuh ID User asli.
    const roomMember = await prisma.roomMember.findUnique({
      where: { id: roomMemberId },
    })

    // Validasi apakah member benar-benar ada di room ini
    if (!roomMember || roomMember.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Member tidak valid atau tidak ada di grup ini" }, { status: 404 })
    }

    // Ambil User ID yang asli
    const realUserId = roomMember.userId; 
    console.log("[API DEBUG] Converted:", { roomMemberId, realUserId })

    // 6. Cek Duplikasi (Agar tidak double invoice)
    const existingInvoice = await prisma.invoice.findFirst({
      where: { 
        dueId: dueIdNum, 
        memberId: realUserId // Cek berdasarkan User ID
      },
    })

    if (existingInvoice) {
      return NextResponse.json({ success: false, message: "Anggota ini sudah memiliki tagihan di iuran ini" }, { status: 400 })
    }

    // 7. Buat Invoice Baru
    const invoice = await prisma.invoice.create({
      data: {
        code: `INV-${dueIdNum}-${realUserId}-${Date.now()}`,
        roomId: roomId,
        memberId: realUserId, // <--- MASUKKAN USER ID (Bukan RoomMember ID)
        dueId: dueIdNum,
        description: due.description || due.name,
        amount: amount,       // <--- Nominal Manual dari Admin
        status: "DRAFT",
        dueDate: due.nextDueDate ? new Date(due.nextDueDate) : new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Anggota berhasil ditambahkan ke iuran",
      data: safeJson(invoice),
    })

  } catch (error) {
    console.error("[API ERROR] Error adding member to due:", error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
  }
}