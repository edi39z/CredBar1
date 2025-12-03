import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { id, dueId } = await params
    const roomId = Number.parseInt(id)
    const dueIdInt = Number.parseInt(dueId)

    if (Number.isNaN(roomId) || Number.isNaN(dueIdInt)) {
      return NextResponse.json({ success: false, message: "Invalid room ID or due ID" }, { status: 400 })
    }

    const due = await prisma.due.findUnique({
      where: { id: dueIdInt },
      include: {
        invoices: {
          include: {
            member: true,
            payments: true,
          },
        },
        room: true,
      },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: due,
    })
  } catch (error) {
    console.error("Error fetching due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { id, dueId } = await params
    const roomId = Number.parseInt(id)
    const dueIdInt = Number.parseInt(dueId)
    const body = await request.json()

    if (Number.isNaN(roomId) || Number.isNaN(dueIdInt)) {
      return NextResponse.json({ success: false, message: "Invalid room ID or due ID" }, { status: 400 })
    }

    // Verifikasi due ada dan milik room
    const due = await prisma.due.findUnique({
      where: { id: dueIdInt },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    // Update due
    const updatedDue = await prisma.due.update({
      where: { id: dueIdInt },
      data: {
        name: body.name || due.name,
        description: body.description !== undefined ? body.description : due.description,
        amount: body.amount ? Number.parseInt(body.amount) : due.amount,
        isRecurring: body.isRecurring !== undefined ? body.isRecurring : due.isRecurring,
        frequency: body.frequency || due.frequency,
        interval: body.interval || due.interval,
        isActive: body.isActive !== undefined ? body.isActive : due.isActive,
      },
      include: {
        invoices: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Due updated successfully",
      data: updatedDue,
    })
  } catch (error) {
    console.error("Error updating due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { id, dueId } = await params
    const roomId = Number.parseInt(id)
    const dueIdInt = Number.parseInt(dueId)

    if (Number.isNaN(roomId) || Number.isNaN(dueIdInt)) {
      return NextResponse.json({ success: false, message: "Invalid room ID or due ID" }, { status: 400 })
    }

    // Verifikasi due ada
    const due = await prisma.due.findUnique({
      where: { id: dueIdInt },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    // Hapus due (invoices akan terhapus otomatis karena onDelete: Cascade)
    await prisma.due.delete({
      where: { id: dueIdInt },
    })

    return NextResponse.json({
      success: true,
      message: "Due deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
