import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"
import { InvoiceStatus, MemberRole, RoomType } from "@prisma/client"

function parseIdStrict(idParam: string) {
    const asNum = Number(idParam)
    if (!Number.isFinite(asNum)) {
        const e: any = new Error("Invalid room id")
        e.status = 400
        throw e
    }
    return asNum
}

async function getMembership(userId: number, roomId: number) {
    return prisma.roomMember.findFirst({ where: { userId, roomId } })
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const user = await requireUser()
        const roomId = parseIdStrict(params.id)

        const member = await getMembership(user.id, roomId)
        if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        })
        if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 })

        const membersCount = await prisma.roomMember.count({ where: { roomId } })
        const pending = await prisma.invoice.count({
            where: { roomId, status: { in: [InvoiceStatus.PENDING, InvoiceStatus.OVERDUE] } },
        })
        const sumAgg = await prisma.invoice.aggregate({ where: { roomId }, _sum: { amount: true } })

        return NextResponse.json({
            room: {
                id: room.id,
                name: room.name,
                type: room.type,
                description: room.description,
                inviteCode: room.inviteCode,
                members: membersCount,
                totalDues: Number(sumAgg._sum?.amount ?? 0), // guard undefined
                pendingPayments: pending,
                role: member.role,
            },
        })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await requireUser()
        const roomId = parseIdStrict(params.id)

        const member = await getMembership(user.id, roomId)
        if (!member || member.role !== MemberRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const body = await req.json()
        const data: any = {}
        if (typeof body.name === "string") data.name = body.name
        if (typeof body.type === "string" && body.type in RoomType) data.type = body.type
        if (typeof body.description === "string") data.description = body.description

        const room = await prisma.room.update({ where: { id: roomId }, data })
        return NextResponse.json({ room })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        const user = await requireUser()
        const roomId = parseIdStrict(params.id)

        const member = await getMembership(user.id, roomId)
        if (!member || member.role !== MemberRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        await prisma.room.delete({ where: { id: roomId } })
        return NextResponse.json({ ok: true })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}
