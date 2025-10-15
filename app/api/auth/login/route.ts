import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json().catch(() => null)) as {
            email?: string
            password?: string
        } | null

        if (!body) return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 })

        const { email, password } = body
        if (!email || !password) {
            return NextResponse.json({ message: "Email dan password harus diisi" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
        }

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) {
            return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
        }

        const token = await signAuthToken({
            sub: String(user.id),
            email: user.email,
            name: user.name || "",
        })

        const res = NextResponse.json({ message: "Login berhasil" }, { status: 200 })
        res.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        })
        return res
    } catch (err) {
        console.error("[v0] login error:", err)
        return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 })
    }
}
