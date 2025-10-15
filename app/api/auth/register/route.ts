import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json().catch(() => null)) as {
            firstName?: string
            lastName?: string
            email?: string
            password?: string
        } | null

        if (!body) {
            return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 })
        }

        const { firstName, lastName, email, password } = body

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 })
        }
        if (!email.includes("@")) {
            return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ message: "Password minimal 6 karakter" }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                email,
                name: `${firstName} ${lastName}`.trim(),
                password: hash, // menyimpan hash di kolom `password`
            },
            select: { id: true, email: true, name: true, createdAt: true },
        })

        return NextResponse.json({ message: "Akun berhasil dibuat", user }, { status: 201 })
    } catch (err) {
        console.error("[v0] register error:", err)
        return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 })
    }
}
