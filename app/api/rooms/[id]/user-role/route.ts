import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roomId = Number(id)

    if (isNaN(roomId)) {
      return NextResponse.json({ success: false, message: "Invalid room ID" }, { status: 400 })
    }

    // 1. COBA AMBIL DARI HEADER (Injeksi Middleware)
    let userId = req.headers.get("x-user-id")

    // 2. FALLBACK: JIKA HEADER KOSONG, BACA COOKIE LANGSUNG DI SINI
    // Ini memastikan API tetap jalan meskipun Middleware gagal inject header
    if (!userId) {
      const token = req.cookies.get("auth_token")?.value
      if (token) {
        try {
          // Decode payload token manual (sama seperti logic middleware)
          const payload = JSON.parse(atob(token.split(".")[1]))
          // Pastikan properti ini sesuai dengan isi token Anda (bisa 'id' atau 'userId')
          userId = payload.id || payload.userId 
        } catch (e) {
          console.error("Token decode failed in API route")
        }
      }
    }

    // Jika setelah fallback userId masih tidak ada, baru return 401
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No User ID found" }, { status: 401 })
    }

    const userIdNum = Number(userId)

    const roomMember = await prisma.roomMember.findFirst({
      where: {
        roomId: roomId,
        userId: userIdNum,
      },
      select: {
        role: true,
      },
    })

    if (!roomMember) {
      // User login tapi bukan anggota grup ini
      return NextResponse.json({ success: false, message: "User not a member of this room" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      role: roomMember.role,
      userId: userIdNum, // Kembalikan ID untuk Frontend
    })
    
  } catch (error) {
    console.error("Error fetching user role:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}