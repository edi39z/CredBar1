import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number(params.id)
    const { email, role = "MEMBER" } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Kalau tidak ditemukan → tidak boleh join
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found. User must be registered before joining room." },
        { status: 404 }
      )
    }

    // Cek sudah jadi member atau belum
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: "User is already a member of this room" },
        { status: 400 }
      )
    }

    // Tambah ke tabel RoomMember
    const member = await prisma.roomMember.create({
      data: {
        roomId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error("Error adding member:", error)
    return NextResponse.json({ success: false, error: "Failed to add member" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number(params.id)

    const members = await prisma.roomMember.findMany({
      where: { roomId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}
