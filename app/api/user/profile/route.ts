import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";

// GET: Ambil data profil dan statistik
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            memberships: true, // Jumlah grup yang diikuti
            invoices: true,    // Jumlah transaksi/tagihan
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      nama: user.name || "",
      email: user.email,
      noTelepon: user.phone || "",
      alamat: user.address || "",
      kota: user.city || "",
      provinsi: user.province || "",
      kodePos: user.zipCode || "",
      tanggalBergabung: user.createdAt.toISOString(),
      stats: [
        { label: "Grup Aktif", value: user._count.memberships.toString(), icon: "👥" },
        { label: "Transaksi", value: user._count.invoices.toString(), icon: "📊" },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update data profil
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    const payload = await verifyAuthToken(token!);
    const userId = Number(payload!.sub);

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.nama,
        phone: body.noTelepon,
        address: body.alamat,
        city: body.kota,
        province: body.provinsi,
        zipCode: body.kodePos,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}