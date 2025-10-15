import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: { code: string } }) {
    try {
        await requireUser() // just to ensure the caller is authenticated
        const code = params.code.toUpperCase()
        const room = await prisma.room.findFirst({
            where: { inviteCode: code },
            select: { id: true, name: true, type: true, description: true, createdById: true },
        })
        if (!room) return NextResponse.json({ valid: false }, { status: 404 })

        const admin = await prisma.user.findUnique({ where: { id: room.createdById }, select: { name: true, email: true } })
        const members = await prisma.roomMember.count({ where: { roomId: room.id } })

        return NextResponse.json({
            valid: true,
            room: { ...room, adminName: admin?.name || "Admin", members },
        })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}
