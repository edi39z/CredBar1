import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function GET() {
    try {
        const user = await requireUser()

        // Rooms where user is a member
        const memberships = await prisma.roomMember.findMany({
            where: { userId: user.id },
            select: { roomId: true, role: true, room: { select: { id: true, name: true, type: true } } },
        })
        const roomIds = memberships.map((m) => m.roomId)

        const pendingInvoicesCount = await prisma.invoice.count({
            where: { roomId: { in: roomIds.length ? roomIds : [-1] }, status: { in: ["PENDING", "OVERDUE"] } },
        })

        const totals = await prisma.invoice.aggregate({
            where: { roomId: { in: roomIds.length ? roomIds : [-1] } },
            _sum: { amount: true },
        })
        const totalDues = Number(totals._sum?.amount || 0)

        const outstandingAgg = await prisma.invoice.aggregate({
            where: { roomId: { in: roomIds.length ? roomIds : [-1] }, status: { in: ["PENDING", "OVERDUE"] } },
            _sum: { amount: true },
        })
        const outstanding = Number(outstandingAgg._sum?.amount || 0)


        // Per room quick cards (limited)
        const perRoom = await Promise.all(
            memberships.slice(0, 9).map(async (m) => {
                const membersCount = await prisma.roomMember.count({ where: { roomId: m.roomId } })
                const pendingCount = await prisma.invoice.count({
                    where: { roomId: m.roomId, status: { in: ["PENDING", "OVERDUE"] } },
                })
                const sumAgg = await prisma.invoice.aggregate({
                    where: { roomId: m.roomId },
                    _sum: { amount: true },
                })
                return {
                    id: m.room!.id,
                    name: m.room!.name,
                    type: m.room!.type,
                    role: m.role,
                    members: membersCount,
                    totalDues: Number(sumAgg._sum.amount || 0),
                    pendingPayments: pendingCount,
                }
            }),
        )

        return NextResponse.json({
            roomsCount: memberships.length,
            pendingPaymentsCount: pendingInvoicesCount,
            totalDues,
            outstanding,
            rooms: perRoom,
        })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}
