import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function safeJson(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  )
}

export async function PATCH(
  request: NextRequest,
  // 1. Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string; dueId: string; invoiceId: string }> }
) {
  try {
    // 2. Lakukan await pada params sebelum destructuring
    const { invoiceId } = await params

    const body = await request.json()
    const amount = Number(body.amount)

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Nominal tidak valid" },
        { status: 400 }
      )
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amount,
      },
    })

    return NextResponse.json({
      success: true,
      data: safeJson(updatedInvoice),
    })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}