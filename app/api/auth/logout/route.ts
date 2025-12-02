import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ message: "Logout berhasil" })

  res.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // hapus cookie
  })

  return res
}
