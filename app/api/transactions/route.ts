import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = Number(payload.sub);

    // 1. INVOICE = UANG KELUAR (User membayar iuran)
    // Kita hanya mengambil yang statusnya PAID agar saldo terpotong saat benar-benar dibayar
    const invoices = await prisma.invoice.findMany({
      where: { 
        memberId: userId,
        status: "PAID" // Opsional: hapus jika ingin semua tagihan (pending) dianggap pengeluaran
      },
      include: { room: true },
    });

    // 2. DEBT (HUTANG) 
    // - Jika kita DEBTOR: UANG KELUAR (Kita berhutang/bayar hutang)
    // - Jika kita CREDITOR: UANG MASUK (Orang bayar ke kita)
    const debtsAsDebtor = await prisma.debt.findMany({
      where: { debtorId: userId, status: "PAID" },
      include: { room: true },
    });

    const debtsAsCreditor = await prisma.debt.findMany({
      where: { creditorId: userId, status: "PAID" },
      include: { room: true },
    });

    // 3. TRANSFORMASI DATA
    
    // Semua tagihan iuran adalah KELUAR
    const iuranKeluar = invoices.map((inv) => ({
      id: `inv-${inv.id}`,
      tipe: "keluar",
      deskripsi: inv.description || `Bayar Iuran: ${inv.code}`,
      nominal: Number(inv.amount),
      tanggal: inv.paidDate?.toISOString() || inv.updatedAt.toISOString(),
      kategori: "Iuran",
      namaGrup: inv.room.name,
    }));

    // Bayar hutang adalah KELUAR
    const hutangKeluar = debtsAsDebtor.map((d) => ({
      id: `debt-out-${d.id}`,
      tipe: "keluar",
      deskripsi: d.description || "Bayar Hutang",
      nominal: Number(d.amount),
      tanggal: d.updatedAt.toISOString(),
      kategori: "Hutang",
      namaGrup: d.room.name,
    }));

    // Terima pembayaran hutang adalah MASUK
    const piutangMasuk = debtsAsCreditor.map((d) => ({
      id: `debt-in-${d.id}`,
      tipe: "masuk",
      deskripsi: d.description || "Terima Pembayaran",
      nominal: Number(d.amount),
      tanggal: d.updatedAt.toISOString(),
      kategori: "Piutang",
      namaGrup: d.room.name,
    }));

    // 4. GABUNGKAN
    const allTransactions = [...iuranKeluar, ...hutangKeluar, ...piutangMasuk].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );

    return NextResponse.json({ transactions: allTransactions });
  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}