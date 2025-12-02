import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("HEADER USER ID:", request.headers.get("x-user-id"))
    const { id } = await params
    const userIdHeader = request.headers.get("x-user-id")
    const currentUserId = userIdHeader ? Number(userIdHeader) : null

    const roomId = Number.parseInt(id)

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        dues: {
          include: {
            invoices: {
              include: {
                member: {
                  select: { id: true, name: true, email: true },
                },
                payments: true,
              },
            },
          },
        },
        invoices: {
          include: {
            member: {
              select: { id: true, name: true, email: true },
            },
            payments: true,
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 })
    }

    let currentUserRole: string | null = null
    if (currentUserId) {
      const currentMember = room.members.find((m) => m.userId === currentUserId)
      currentUserRole = currentMember?.role || null
    }

    return NextResponse.json({
      success: true,
      data: room,
      currentUserRole,
    })
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.room.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ success: true, message: "Room deleted" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete room" }, { status: 500 })
  }
}
