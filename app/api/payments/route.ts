import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = await verifyAuthToken(token)
    if (!payload || !payload.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const userId = Number(payload.sub)

    const invoices = await prisma.invoice.findMany({
      where: {
        memberId: userId 
      },
      orderBy: { 
        createdAt: "desc" 
      },
      include: {
        room: { select: { name: true } },
        member: { select: { name: true } },
        payments: {
          orderBy: { paidAt: "desc" },
          take: 1,
          // Perbaikan: include createdBy di sini
          include: {
            createdBy: { select: { name: true } }
          }
        }
      }
    })

    const mapped = invoices.map((inv) => {
      let statusMapping = inv.status;
      if (inv.status === "DRAFT") {
        statusMapping = "PENDING";
      }

      return {
        id: inv.id,
        amount: inv.amount.toString(),
        paidAt: inv.paidDate || inv.payments[0]?.paidAt || null,
        invoiceCode: inv.code,
        invoiceStatus: statusMapping,
        groupName: inv.room?.name || "Grup Umum",
        memberName: inv.member?.name || "Saya",
        // Sekarang ini sudah aman dan tidak akan error lagi
        createdByName: inv.payments[0]?.createdBy?.name || "System",
      }
    })

    return NextResponse.json(mapped)
  } catch (err) {
    console.error("Payment API Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}