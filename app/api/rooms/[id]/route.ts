import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Fungsi helper untuk serialize BigInt
function fixBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === "bigint") return Number(obj)
  if (Array.isArray(obj)) return obj.map(fixBigInt)
  if (typeof obj === "object") {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = fixBigInt(obj[key])
    }
    return newObj
  }
  return obj
}

// ==================================================
// GET ROOM DETAIL
// ==================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 15: params adalah Promise
) {
  try {
    const { id } = await params // Await params
    const roomId = Number(id)
    
    // Ambil ID User dari Header (Middleware)
    const userIdHeader = request.headers.get("x-user-id")
    const currentUserId = userIdHeader ? Number(userIdHeader) : null

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: "Invalid room ID" },
        { status: 400 }
      )
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        createdBy: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        dues: {
          include: {
            invoices: {
              include: {
                member: { select: { id: true, name: true, email: true } },
                payments: true,
              },
            },
          },
        },
        invoices: {
          include: {
            member: { select: { id: true, name: true, email: true } },
            payments: true,
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      )
    }

    // Tentukan Role User yang sedang login
    let currentUserRole: string | null = null
    if (currentUserId) {
      const currentMember = room.members.find((m) => m.userId === currentUserId)
      currentUserRole = currentMember?.role ?? null
    }

    // --- RETURN RESPONSE ---
    // PENTING: sertakan currentUserId agar frontend bisa memfilter tagihan
    return NextResponse.json({
      success: true,
      data: fixBigInt(room),
      currentUserRole,
      currentUserId, // <--- INI YANG DITAMBAHKAN
    })

  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch room" },
      { status: 500 }
    )
  }
}

// ==================================================
// DELETE ROOM
// ==================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Await params
    const roomId = Number(id)

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: "Invalid room ID" },
        { status: 400 }
      )
    }

    await prisma.room.delete({
      where: { id: roomId },
    })

    return NextResponse.json({ success: true, message: "Room deleted" })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete room" },
      { status: 500 }
    )
  }
}

// ==================================================
// UPDATE ROOM
// ==================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Await params
    const roomId = Number(id)

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: "Invalid room ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama tidak boleh kosong" },
        { status: 400 }
      )
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: name.trim(),
        description: description || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Room updated successfully",
      data: fixBigInt(updatedRoom),
    })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update room" },
      { status: 500 }
    )
  }
}