import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const payload = await verifyAuthToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  return NextResponse.json({
    userId: payload.sub,
    email: payload.email,
  })
}
