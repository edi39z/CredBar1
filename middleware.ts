import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ROUTE yang butuh login
const PROTECTED_ROUTES = ["/dashboard", "/profile"]

// ROUTE yang tidak boleh diakses jika sudah login
const AUTH_PAGES = ["/login", "/register", "/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value || null

  // DECODE PAYLOAD TOKEn (tanpa verify signature)
  let payload: any = null
  if (token) {
    try {
      payload = JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
      payload = null
    }
  }

  // 1️⃣ Jika akses halaman public (login, register, home) dan token valid → redirect dashboard
  const accessingAuthPage = AUTH_PAGES.some((route) => pathname === route)
  if (accessingAuthPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2️⃣ Jika akses protected route & tidak ada token → redirect login
  const accessingProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (accessingProtected && !payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // lanjut jika semuanya ok
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
