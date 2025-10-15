import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

const ALG = "HS256"

function getSecret() {
    // Prefer standard JWT_SECRET, but also support NEXT_JS_JWT_SECRET as you've set it in Vars
    const configured =
        process.env.JWT_SECRET ||
        process.env.NEXT_JS_JWT_SECRET ||
        process.env.NEXTJS_JWT_SECRET ||
        process.env.NEXT_JWT_SECRET ||
        process.env.NEXT_PUBLIC_JWT_SECRET ||
        // bracket access to allow unusual var names like "Next.jsJWT_SECRET"
        (process.env as Record<string, string | undefined>)["Next.jsJWT_SECRET"] ||
        null
    if (!configured) {
        if (process.env.NODE_ENV !== "production") {
            const dev = "unsafe-dev-secret-change-me"
            try {
                if (!(globalThis as any).__DEV_JWT_WARNED) {
                    console.warn(
                        "[v0] JWT secret tidak ditemukan. Menggunakan dev fallback. Tambahkan JWT_SECRET atau NEXT_JS_JWT_SECRET di Vars untuk production.",
                    )
                        ; (globalThis as any).__DEV_JWT_WARNED = true
                }
            } catch { }
            return new TextEncoder().encode(dev)
        }
        throw new Error("Missing JWT secret in Vars")
    }
    return new TextEncoder().encode(configured)
}

export async function signAuthToken(payload: JWTPayload & { sub: string }) {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 hari
    return new SignJWT({ ...payload, exp })
        .setProtectedHeader({ alg: ALG })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(getSecret())
}

export async function verifyAuthToken(token: string) {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] })
    return payload
}

export async function getUserFromRequest(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value
    if (!token) return null
    try {
        const payload = await verifyAuthToken(token)
        return payload // { sub, email, name, exp, iat }
    } catch {
        return null
    }
}

// helper untuk melempar error dengan status agar ditangkap di route handlers
function httpError(message: string, status = 400) {
    const e: any = new Error(message)
    e.status = status
    return e
}

export async function requireUser() {
    const token = cookies().get("auth_token")?.value
    if (!token) {
        const e: any = new Error("Unauthorized")
        e.status = 401
        throw e
    }
    try {
        const payload = await verifyAuthToken(token)
        const sub = payload.sub as string | undefined
        const idNum = Number(sub)
        if (!sub || !Number.isFinite(idNum)) {
            const e: any = new Error("Unauthorized")
            e.status = 401
            throw e
        }
        return {
            id: idNum, // numeric id
            email: (payload.email as string | undefined) || undefined,
            name: (payload.name as string | undefined) || undefined,
        }
    } catch {
        const e: any = new Error("Unauthorized")
        e.status = 401
        throw e
    }
}
