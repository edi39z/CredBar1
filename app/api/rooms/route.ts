import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Ambil user login dari middleware
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
        nominal: 0,
        tanggalJatuhTempo: new Date().toISOString().split("T")[0],
        jumlahAnggota: room.members.length,
        totalTerkumpul: 0,
        status: "aktif",
        role: currentMember?.role === "ADMIN" ? "admin" : "member",
        members: room.members.map((m) => ({
          id: m.user.id.toString(),
          nama: m.user.name || "Unknown",
          email: m.user.email,
          status: m.role === "ADMIN" ? "lunas" : "menunggu",
          nominal: 0,
        })),
        createdAt: room.createdAt.toISOString().split("T")[0],
      }
    })

    return NextResponse.json(transformedRooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, deskripsi, nominal, tanggalJatuhTempo } = body

    const userIdHeader = request.headers.get("x-user-id")
    const userId = userIdHeader ? Number(userIdHeader) : null

    if (!nama || !nominal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      nominal,
      tanggalJatuhTempo,
      jumlahAnggota: newRoom.members.length,
      totalTerkumpul: 0,
      status: "aktif",
      role: "admin",
      members: newRoom.members.map((m) => ({
        id: m.user.id.toString(),
        nama: m.user.name || "Unknown",
        email: m.user.email,
        status: "lunas",
        nominal,
      })),
      createdAt: newRoom.createdAt.toISOString().split("T")[0],
    }

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
