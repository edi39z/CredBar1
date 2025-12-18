import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

function toSafeJSON(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = Number(payload.sub);

    console.log(`\n================ DEBUG DASHBOARD USER ${userId} ================`);

    // 1. Ambil SEMUA Invoice
    const allInvoices = await prisma.invoice.findMany({
      where: { memberId: userId },
      include: {
        room: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" }
    });

    console.log(`[DATABASE] Jumlah total invoice ditemukan: ${allInvoices.length}`);
    if (allInvoices.length > 0) {
      console.log(`[DATABASE] Contoh status invoice pertama: ${allInvoices[0].status}`);
      console.log(`[DATABASE] Contoh tanggal invoice pertama: ${allInvoices[0].createdAt}`);
    }

    // 2. Filter 30 Hari
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log(`[FILTER] Mencari data sejak tanggal: ${thirtyDaysAgo.toISOString()}`);

    const filteredInvoices = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= thirtyDaysAgo;
    });

    console.log(`[FILTER] Jumlah invoice yang lolos filter 30 hari: ${filteredInvoices.length}`);

    // 3. Mapping Data untuk Grafik
    const paymentProgressData = filteredInvoices.map((inv) => {
        const isPaid = inv.status === "PAID";
        const nominal = Number(inv.amount);
        
        // Logika debug per baris (Hanya tampilkan 3 teratas agar tidak spam log)
        return {
          date: new Date(inv.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
          paid: isPaid ? nominal : 0,
          pending: !isPaid ? nominal : 0,
        };
      }).reverse();

    console.log(`[FINAL] Isi paymentProgressData yang dikirim ke frontend:`, JSON.stringify(paymentProgressData, null, 2));

    // --- SISANYA TETAP SAMA ---
    const totalGroups = await prisma.roomMember.count({ where: { userId, status: "ACTIVE" } });
    const unpaidAmount = allInvoices
      .filter(inv => ["PENDING", "OVERDUE", "DRAFT"].includes(inv.status))
      .reduce((acc, inv) => acc + Number(inv.amount), 0);

    const duesBreakdown = await prisma.due.findMany({
      where: { room: { members: { some: { userId, status: "ACTIVE" } } }, isActive: true },
      select: { id: true, name: true, amount: true },
      take: 5
    });

    const transactions = allInvoices.slice(0, 10).map((inv) => ({
      id: inv.id,
      group: inv.room?.name || "Grup Umum",
      amount: inv.amount,
      date: inv.paidDate || inv.createdAt,
      status: inv.status === "PAID" ? "Lunas" : "Menunggu",
      invoiceCode: inv.code,
    }));

    console.log(`================ DEBUG END ================\n`);

    return NextResponse.json(
      toSafeJSON({
        totalGroups,
        unpaidAmount,
        paymentProgressData,
        duesBreakdown,
        transactions,
      })
    );

  } catch (err) {
    console.error("CRITICAL DASHBOARD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}