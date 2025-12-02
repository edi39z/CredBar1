import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dues = await prisma.due.findMany({
      where: { roomId: Number.parseInt(id) },
      include: {
        invoices: {
          include: {
            payments: true,
            member: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: dues })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch dues" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, amount, isRecurring, frequency, interval, startDate } = body

    const due = await prisma.due.create({
      data: {
        roomId: Number.parseInt(id),
        name,
        description,
        amount,
        isRecurring,
        frequency,
        interval,
        startDate: startDate ? new Date(startDate) : undefined,
        nextDueDate: startDate ? new Date(startDate) : new Date(),
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
    return NextResponse.json({ success: false, error: "Failed to create due" }, { status: 500 })
  }
}
