import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ROUTE yang butuh login
const PROTECTED_ROUTES = ["/dashboard", "/profile"]

// ROUTE yang tidak boleh diakses jika sudah login
const AUTH_PAGES = ["/login", "/register", "/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value || null

  // --- DEBUGGING LOG (Cek di terminal VSCode) ---
  // console.log(`[Middleware] Processing: ${pathname}`)
  // ---------------------------------------------

  // DECODE PAYLOAD TOKEN
  let payload: any = null
  if (token) {
    try {
      // Decode base64 token part
      payload = JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
      console.error("[Middleware] Error decoding token:", e)
      payload = null
    }
  }

  // 1️⃣ Jika akses halaman public dan token valid → redirect dashboard
  const accessingAuthPage = AUTH_PAGES.some((route) => pathname === route)
  if (accessingAuthPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2️⃣ Jika akses protected route & tidak ada token → redirect login
  const accessingProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (accessingProtected && !payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ============================================================
  // PERBAIKAN UTAMA: Inject Header x-user-id ke Request
  // ============================================================
  
  const requestHeaders = new Headers(request.headers)

  if (payload) {
    // Pastikan key-nya benar ('id' atau 'userId' atau 'sub') sesuai isi token kamu
    const userId = payload.id || payload.userId || payload.sub
    
    if (userId) {
      // console.log(`[Middleware] Injecting x-user-id: ${userId}`) // Debugging
      requestHeaders.set("x-user-id", String(userId))
    } else {
      console.warn("[Middleware] Token valid tapi tidak ada field ID/userId")
    }
  }

  // Lanjut dengan membawa headers yang sudah dimodifikasi
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Matcher ini akan menangkap semua route termasuk API
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}