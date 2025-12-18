import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuthToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = await verifyAuthToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const userId = Number(payload.sub)

    // 1. Ambil data (Hanya yang berstatus PAID/Lunas untuk laporan keuangan)
    const invoices = await prisma.invoice.findMany({
      where: { memberId: userId, status: "PAID" },
      include: { room: true },
    })

    const debtsPaidAsDebtor = await prisma.debt.findMany({
      where: { debtorId: userId, status: "PAID" },
      include: { room: true },
    })

    const debtsPaidAsCreditor = await prisma.debt.findMany({
      where: { creditorId: userId, status: "PAID" },
      include: { room: true },
    })

    // 2. Agregasi Data Bulanan
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
    const monthlyDataMap: Record<string, { bulan: string; masuk: number; keluar: number }> = {}

    const getMonthName = (date: Date) => months[date.getMonth()]

    // --- LOGIKA KELUAR: Iuran & Bayar Hutang ---
    invoices.forEach((inv) => {
      const month = getMonthName(inv.paidDate || inv.createdAt)
      if (!monthlyDataMap[month]) monthlyDataMap[month] = { bulan: month, masuk: 0, keluar: 0 }
      monthlyDataMap[month].keluar += Number(inv.amount)
    })

    debtsPaidAsDebtor.forEach((debt) => {
      const month = getMonthName(debt.updatedAt || debt.createdAt)
      if (!monthlyDataMap[month]) monthlyDataMap[month] = { bulan: month, masuk: 0, keluar: 0 }
      monthlyDataMap[month].keluar += Number(debt.amount)
    })

    // --- LOGIKA MASUK: Terima pembayaran dari orang lain ---
    debtsPaidAsCreditor.forEach((debt) => {
      const month = getMonthName(debt.updatedAt || debt.createdAt)
      if (!monthlyDataMap[month]) monthlyDataMap[month] = { bulan: month, masuk: 0, keluar: 0 }
      monthlyDataMap[month].masuk += Number(debt.amount)
    })

    const monthlyData = Object.values(monthlyDataMap)

    // 3. Distribusi Iuran per Grup (Pengeluaran per Grup)
    const groupDataMap: Record<string, { name: string; value: number }> = {}
    invoices.forEach((inv) => {
      const roomName = inv.room.name
      if (!groupDataMap[roomName]) groupDataMap[roomName] = { name: roomName, value: 0 }
      groupDataMap[roomName].value += Number(inv.amount)
    })
    const groupData = Object.values(groupDataMap)

    // 4. Statistik Utama
    const totalKeluar = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0) + 
                        debtsPaidAsDebtor.reduce((sum, d) => sum + Number(d.amount), 0)
    
    const totalMasuk = debtsPaidAsCreditor.reduce((sum, d) => sum + Number(d.amount), 0)
    
    const saldo = totalMasuk - totalKeluar
    // Rata-rata pengeluaran bulanan
    const rataRata = monthlyData.length > 0 ? totalKeluar / monthlyData.length : 0

    return NextResponse.json({
      stats: [
        { label: "Total Pemasukan", value: `Rp ${totalMasuk.toLocaleString("id-ID")}`, color: "bg-green-500", change: "+0%" },
        { label: "Total Pengeluaran", value: `Rp ${totalKeluar.toLocaleString("id-ID")}`, color: "bg-red-500", change: "+0%" },
        { label: "Saldo Bersih", value: `Rp ${saldo.toLocaleString("id-ID")}`, color: "bg-blue-500", change: "+0%" },
        { label: "Rata-rata Pengeluaran", value: `Rp ${rataRata.toLocaleString("id-ID")}`, color: "bg-purple-500", change: "+0%" },
      ],
      monthlyData,
      groupData,
    })
  } catch (error) {
    console.error("Report Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}