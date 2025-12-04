import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ==================================================
// PUT: Update Role Member
// ==================================================
export async function PUT(
  request: Request,
  // 1. Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string; memberid: string }> }
) {
  try {
    // 2. Lakukan await pada params sebelum mengambil properti
    const { memberid } = await params
    const memberId = Number(memberid)

    const body = await request.json()
    const { role } = body

    if (!memberId || !role) {
      return NextResponse.json(
        { success: false, error: "memberId and role are required" },
        { status: 400 }
      )
    }

    // Ambil data member
    const existingMember = await prisma.roomMember.findUnique({
      where: { id: memberId },
      select: { role: true, roomId: true },
    })

    if (!existingMember) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 })
    }

    // Cek jumlah admin dalam room
    const adminCount = await prisma.roomMember.count({
      where: { roomId: existingMember.roomId, role: "ADMIN" },
    })

    // Jika hanya satu admin dan dia mau ganti ke MEMBER → tidak boleh
    if (existingMember.role === "ADMIN" && role === "MEMBER" && adminCount === 1) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus admin terakhir dari grup" },
        { status: 400 }
      )
    }

    const updated = await prisma.roomMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ success: false, error: "Failed to update role" }, { status: 500 })
  }
}

// ==================================================
// DELETE: Hapus Member
// ==================================================
export async function DELETE(
  request: Request,
  // 1. Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string; memberid: string }> }
) {
  try {
    // 2. Lakukan await pada params
    const { memberid } = await params
    const memberId = Number(memberid)

    if (!memberId) {
      return NextResponse.json({ success: false, error: "memberId is required" }, { status: 400 })
    }

    await prisma.roomMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true, message: "Member removed successfully" })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ success: false, error: "Failed to delete member" }, { status: 500 })
  }
}