import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ====================== GET ROOMS ======================
export async function GET(request: NextRequest) {
  try {
    const userIdHeader = request.headers.get("x-user-id")
    const userId = userIdHeader ? Number(userIdHeader) : null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rooms = await prisma.room.findMany({
      where: {
        members: {
          some: {
            userId,
            status: "ACTIVE",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const transformedRooms = rooms.map((room) => {
      const currentMember = room.members.find((m) => m.userId === userId)

      return {
        id: room.id.toString(),
        nama: room.name,
        deskripsi: room.description || "",
        jumlahAnggota: room.members.length,
        role: currentMember?.role === "ADMIN" ? "admin" : "member",

        members: room.members.map((m) => ({
          id: m.user.id.toString(),
          nama: m.user.name || "Unknown",
          email: m.user.email,
          avatarUrl: m.user.avatarUrl,
        })),

        createdAt: room.createdAt.toISOString(),
      }
    })

    return NextResponse.json(transformedRooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

// ====================== CREATE ROOM ======================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, deskripsi } = body

    const userIdHeader = request.headers.get("x-user-id")
    const userId = userIdHeader ? Number(userIdHeader) : null

    if (!nama) {
      return NextResponse.json({ error: "Nama group wajib diisi" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newRoom = await prisma.room.create({
      data: {
        name: nama,
        description: deskripsi,
        createdById: userId,
        type: "CUSTOM",
        inviteCode: `INV-${Date.now()}`,
        members: {
          create: {
            userId,
            role: "ADMIN",
            status: "ACTIVE",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    })

    const transformed = {
      id: newRoom.id.toString(),
      nama: newRoom.name,
      deskripsi: newRoom.description || "",
      jumlahAnggota: newRoom.members.length,
      role: "admin",

      members: newRoom.members.map((m) => ({
        id: m.user.id.toString(),
        nama: m.user.name || "Unknown",
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
      })),

      createdAt: newRoom.createdAt.toISOString(),
    }

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
