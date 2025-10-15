import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"
import { InvoiceStatus, MemberRole, RoomType } from "@prisma/client" // use enum for role

function genInviteCode(len = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let out = ""
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
    return out
}

export async function GET() {
    try {
        const user = await requireUser()

        const rooms = await prisma.room.findMany({
            where: { members: { some: { userId: user.id } } },
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        })

        const payload = await Promise.all(
            rooms.map(async (r) => {
                const members = await prisma.roomMember.count({ where: { roomId: (r as any).id } })
                const pending = await prisma.invoice.count({
                    where: { roomId: (r as any).id, status: { in: [InvoiceStatus.PENDING, InvoiceStatus.OVERDUE] } },
                })
                const sumAgg = await prisma.invoice.aggregate({
                    where: { roomId: (r as any).id },
                    _sum: { amount: true },
                })
                return {
                    id: r.id,
                    name: r.name,
                    type: r.type,
                    // currency: r.currency, // removed
                    members,
                    totalDues: Number(sumAgg._sum?.amount ?? 0),
                    pendingPayments: pending,
                }
            }),
        )

        return NextResponse.json({ rooms: payload })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireUser()
        const body = await req.json()
        const { name, type, description = "" } = body || {}

        if (!name) {
            return NextResponse.json({ error: "name is required" }, { status: 400 })
        }

        let roomType: keyof typeof RoomType | undefined
        if (typeof type === "string" && type in RoomType) {
            roomType = type as keyof typeof RoomType
        }

        const baseData: any = {
            name,
            description,
            createdById: user.id,
        }
        if (roomType) baseData.type = roomType

        let created: any = null
        let lastErr: any = null
        for (let attempt = 0; attempt < 3; attempt++) {
            const inviteCode = genInviteCode()
            try {
                created = await prisma.room.create({
                    data: { ...baseData, inviteCode },
                })
                break
            } catch (e: any) {
                lastErr = e
                // if unique constraint on inviteCode, retry with new code
                const msg = e?.message || ""
                if (!/Unique constraint/i.test(msg)) {
                    break
                }
            }
        }
        if (!created) {
            throw lastErr || new Error("Failed to create room")
        }

        // attach creator as ADMIN member (role enum safe)
        try {
            await prisma.roomMember.create({
                data: { roomId: (created as any).id, userId: user.id, role: MemberRole.ADMIN },
            })
        } catch (e) {
            // optional: log or ignore membership error
        }

        return NextResponse.json({ room: created }, { status: 201 })
    } catch (err: any) {
        const status = err?.status || 500
        return NextResponse.json({ error: err?.message || "Internal Error" }, { status })
    }
}
