import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roomId = Number.parseInt(id)

    if (Number.isNaN(roomId)) {
      return NextResponse.json({ success: false, message: "Invalid room ID" }, { status: 400 })
    }

    // Verifikasi room ada
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 })
    }

    // Ambil semua due berdasarkan room
    const dues = await prisma.due.findMany({
      where: { roomId: roomId },
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
      data: dues,
    })
  } catch (error) {
    console.error("Error fetching dues:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roomId = Number.parseInt(id)

    if (Number.isNaN(roomId)) {
      return NextResponse.json({ success: false, message: "Invalid room ID" }, { status: 400 })
    }

    const body = await request.json()

    // Validasi room ada
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 })
    }

    // Validasi data
    if (!body.name || !body.amount) {
      return NextResponse.json({ success: false, message: "Name and amount are required" }, { status: 400 })
    }

    // Buat due baru
    const due = await prisma.due.create({
      data: {
        roomId: roomId,
        name: body.name,
        description: body.description || null,
        amount: Number.parseInt(body.amount),
        isRecurring: body.isRecurring || false,
        frequency: body.frequency || null,
        interval: body.interval || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        isActive: true,
      },
      include: {
        invoices: true,
      },
    })

    // Buat invoice otomatis untuk setiap member
    const members = await prisma.roomMember.findMany({
      where: { roomId: roomId, status: "ACTIVE" },
    })

    for (const member of members) {
      await prisma.invoice.create({
        data: {
          code: `INV-${due.id}-${member.id}-${Date.now()}`,
          roomId: roomId,
          memberId: member.id,
          dueId: due.id,
          description: body.description || body.name,
          amount: Number.parseInt(body.amount),
          status: "DRAFT",
          dueDate: body.startDate ? new Date(body.startDate) : new Date(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Due created successfully",
      data: due,
    })
  } catch (error) {
    console.error("Error creating due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
