import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ====== Helper untuk BigInt serialization ======
function safeJson(data: any) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)))
}

function parseDate(dateString: string | undefined): Date | null {
  if (!dateString) return null

  try {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateString)) {
      throw new Error(`Invalid date format: ${dateString}. Use YYYY-MM-DD`)
    }
    const [year, month, day] = dateString.split("-").map(Number)
    if (year < 1900 || year > 2100) throw new Error(`Invalid year`)
    if (month < 1 || month > 12) throw new Error(`Invalid month`)
    if (day < 1 || day > 31) throw new Error(`Invalid day`)

    const date = new Date(`${dateString}T00:00:00Z`)
    if (isNaN(date.getTime())) throw new Error(`Invalid date`)
    return date
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : `Invalid date format`)
  }
}

// =============================
// GET /api/rooms/[id]/dues
// =============================
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roomId = Number(id)

    if (isNaN(roomId)) {
      return NextResponse.json({ success: false, message: "Invalid room ID" }, { status: 400 })
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 })
    }

    const dues = await prisma.due.findMany({
      where: { roomId },
      include: {
        invoices: {
          include: {
            member: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: safeJson(dues),
    })
  } catch (error) {
    console.error("Error fetching dues:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// =============================
// POST /api/rooms/[id]/dues
// =============================
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roomId = Number(id)

    if (isNaN(roomId)) {
      return NextResponse.json({ success: false, message: "Invalid room ID" }, { status: 400 })
    }

    const body = await req.json()
    console.log("[v0] Received body:", body)

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, message: "Nama iuran harus diisi" }, { status: 400 })
    }

    if (body.amount === undefined || body.amount === null || body.amount === "") {
      return NextResponse.json({ success: false, message: "Nominal harus diisi" }, { status: 400 })
    }

    if (!body.nextDueDate) {
      return NextResponse.json({ success: false, message: "Tanggal jatuh tempo harus diisi" }, { status: 400 })
    }

    if (body.isRecurring && !body.startDate) {
      return NextResponse.json(
        { success: false, message: "Tanggal mulai harus diisi untuk iuran berulang" },
        { status: 400 },
      )
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) {
      return NextResponse.json({ success: false, message: "Room tidak ditemukan" }, { status: 404 })
    }

    let amountBigInt: bigint
    try {
      const amountNum = Number(body.amount)
      if (isNaN(amountNum) || amountNum < 0) {
        throw new Error("Nominal harus berupa angka positif")
      }
      amountBigInt = BigInt(Math.floor(amountNum))
    } catch (error) {
      return NextResponse.json({ success: false, message: "Format nominal tidak valid" }, { status: 400 })
    }

    let nextDueDate: Date
    let startDate: Date | null = null

    try {
      console.log("[v0] Parsing nextDueDate:", body.nextDueDate)
      nextDueDate = parseDate(body.nextDueDate)!

      if (body.isRecurring) {
        console.log("[v0] Parsing startDate:", body.startDate)
        startDate = parseDate(body.startDate)!
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Format tanggal tidak valid"
      console.error("[v0] Date parsing error:", errorMessage)
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 },
      )
    }

    // Buat Due (Iuran)
    const due = await prisma.due.create({
      data: {
        roomId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        amount: amountBigInt,
        isRecurring: body.isRecurring ?? false,
        frequency: body.isRecurring ? body.frequency || "MONTHLY" : null,
        interval: body.isRecurring ? Math.max(1, Number(body.interval) || 1) : null,
        startDate: startDate,
        nextDueDate: nextDueDate,
        isActive: true,
      },
    })

    console.log("[v0] Due created successfully:", due.id)

    // --- BAGIAN INI DIHAPUS AGAR MEMBER TIDAK OTOMATIS DITAGIH ---
    /*
    const members = await prisma.roomMember.findMany({
      where: { roomId, status: "ACTIVE" },
    })

    for (const member of members) {
      await prisma.invoice.create({ ... })
    }
    */
    // -------------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Iuran berhasil dibuat (Silakan tambahkan anggota secara manual)",
      data: safeJson(due),
    })
  } catch (error) {
    console.error("[v0] Error creating due:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan iuran",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}