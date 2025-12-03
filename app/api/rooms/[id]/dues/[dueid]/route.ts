import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ====== Helper untuk BigInt serialization ======
function safeJson(data: any) {
  return JSON.parse(JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)))
}

// =============================
// PUT /api/rooms/[id]/dues/[dueId]
// =============================
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { id, dueId } = await params
    const roomId = Number(id)
    const dueIdNum = Number(dueId)

    if (isNaN(roomId) || isNaN(dueIdNum)) {
      return NextResponse.json({ success: false, message: "Invalid IDs" }, { status: 400 })
    }

    const body = await req.json()

    const due = await prisma.due.findUnique({
      where: { id: dueIdNum },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    let amountBigInt: bigint
    try {
      amountBigInt = BigInt(body.amount)
    } catch {
      return NextResponse.json({ success: false, message: "Invalid amount format" }, { status: 400 })
    }

    const updatedDue = await prisma.due.update({
      where: { id: dueIdNum },
      data: {
        name: body.name ?? due.name,
        description: body.description ?? due.description,
        amount: amountBigInt,
        isRecurring: body.isRecurring ?? due.isRecurring,
        frequency: body.isRecurring ? body.frequency || due.frequency : null,
        interval: body.isRecurring ? body.interval || due.interval : null,
        startDate: body.startDate ? new Date(body.startDate) : due.startDate,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : due.nextDueDate,
      },
    })

    if (body.amount) {
      await prisma.invoice.updateMany({
        where: { dueId: dueIdNum },
        data: {
          amount: amountBigInt,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Due updated successfully",
      data: safeJson(updatedDue),
    })
  } catch (error) {
    console.error("Error updating due:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// =============================
// DELETE /api/rooms/[id]/dues/[dueId]
// =============================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { id, dueId } = await params
    const roomId = Number(id)
    const dueIdNum = Number(dueId)

    if (isNaN(roomId) || isNaN(dueIdNum)) {
      return NextResponse.json({ success: false, message: "Invalid IDs" }, { status: 400 })
    }

    const due = await prisma.due.findUnique({
      where: { id: dueIdNum },
    })

    if (!due || due.roomId !== roomId) {
      return NextResponse.json({ success: false, message: "Due not found" }, { status: 404 })
    }

    await prisma.invoice.deleteMany({
      where: { dueId: dueIdNum },
    })

    await prisma.due.delete({
      where: { id: dueIdNum },
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
