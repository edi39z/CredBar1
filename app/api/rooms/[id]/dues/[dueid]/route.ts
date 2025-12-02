import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { dueId } = await params
    const due = await prisma.due.findUnique({
      where: { id: Number.parseInt(dueId) },
      include: {
        invoices: {
          include: {
            payments: true,
            member: true,
          },
        },
      },
    })

    if (!due) {
      return NextResponse.json({ success: false, error: "Due not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: due })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch due" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { dueId } = await params
    const body = await request.json()
    const { name, description, amount, isActive } = body

    const due = await prisma.due.update({
      where: { id: Number.parseInt(dueId) },
      data: {
        name,
        description,
        amount,
        isActive,
      },
      include: {
        invoices: {
          include: {
            payments: true,
            member: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: due })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update due" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; dueId: string }> }) {
  try {
    const { dueId } = await params

    await prisma.due.delete({
      where: { id: Number.parseInt(dueId) },
    })

    return NextResponse.json({ success: true, message: "Due deleted" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete due" }, { status: 500 })
  }
}
