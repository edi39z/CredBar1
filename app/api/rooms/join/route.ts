import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const user = await requireUser()
        const { inviteCode } = await req.json()

        if (!inviteCode) return NextResponse.json({ error: "inviteCode is required" }, { status: 400 })

        const room = await prisma.room.findFirst({ where: { inviteCode: inviteCode.toUpperCase() } })
        if (!room) return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })

        // Avoid duplicate membership
        const existing = await prisma.roomMember.findFirst({ where: { roomId: room.id, userId: user.id } })
        if (existing) return NextResponse.json({ ok: true, alreadyMember: true, roomId: room.id })

        await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id, role: "MEMBER" } })
        return NextResponse.json({ ok: true, roomId: room.id })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}
