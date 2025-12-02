import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // ======================
        // 1. TOTAL GROUP (Room)
        // ======================
        const totalGroups = await prisma.room.count();

        // ============================
        // 2. TAGIHAN TERTUNDA (Invoice)
        // ============================
        const unpaid = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { status: "PENDING" }
        });

        // ==============================
        // 3. PROGRESS PEMBAYARAN MINGGUAN
        // ==============================
        const weeklyProgress = await prisma.invoice.findMany({
            select: {
                id: true,
                paidDate: true,
                status: true,
                createdAt: true
            }
        });

        // Kamu bisa mapping sesuai format chart
        // (sementara aku kosongin dulu sampai DB kamu ada datanya)
        const paymentProgressData: never[] = [];

        // ==========================
        // 4. BREAKDOWN IURAN per DUE
        // ==========================
        const dues = await prisma.due.findMany({
            select: {
                name: true,
                amount: true
            }
        });

        const breakdown = dues.map(d => ({
            name: d.name,
            amount: d.amount,
        }));

        // ==========================
        // 5. TRANSACTION HISTORY
        // ==========================
        const transactions = await prisma.payment.findMany({
            orderBy: { paidAt: "desc" },
            take: 10,
            select: {
                id: true,
                amount: true,
                paidAt: true,
                invoice: {
                    select: {
                        code: true,
                        room: { select: { name: true } },
                        member: { select: { name: true } },
                        status: true
                    }
                }
            }
        });

        const mappedTx = transactions.map(t => ({
            id: t.id,
            name: t.invoice.member.name,
            group: t.invoice.room.name,
            amount: t.amount,
            date: t.paidAt,
            status: t.invoice.status === "PAID" ? "Lunas" : "Menunggu",
        }));

        return NextResponse.json({
            totalGroups,
            unpaidAmount: unpaid._sum.amount ?? 0,
            paymentProgressData,
            breakdown,
            transactions: mappedTx,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
