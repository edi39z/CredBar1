"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Users, CreditCard, TrendingUp, Bell, Settings, Search, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#3A86FF", "#10B981", "#FF6B6B", "#8B5CF6", "#F59E0B"]

// 1. DEFINISIKAN INTERFACE TIPE DATA SESUAI API
interface Transaction {
  id: string | number
  group: string
  amount: number
  date: string
  status: string
  invoiceCode: string
}

interface DueBreakdown {
  id: number
  name: string
  amount: number
  isActive: boolean
}

interface PaymentProgress {
  date: string
  amount: number
  groupName: string
}

interface DashboardData {
  totalGroups: number
  unpaidAmount: number
  paymentProgressData: PaymentProgress[]
  duesBreakdown: DueBreakdown[] // Nama disesuaikan dengan API Backend
  transactions: Transaction[]
}

export function DashboardNew() {
    const [timeRange, setTimeRange] = useState("hari-ini")
    const [loading, setLoading] = useState(true)

    // 2. INITIAL STATE DENGAN ARRAY KOSONG AGAR .length TIDAK ERROR
    const [data, setData] = useState<DashboardData>({
        totalGroups: 0,
        unpaidAmount: 0,
        paymentProgressData: [],
        duesBreakdown: [], 
        transactions: []
    })

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/dashboard")
                if (!res.ok) throw new Error("Gagal mengambil data")
                const json = await res.json()
                
                // Pastikan data yang di-set memiliki struktur yang benar
                setData({
                    totalGroups: json.totalGroups || 0,
                    unpaidAmount: json.unpaidAmount || 0,
                    paymentProgressData: json.paymentProgressData || [],
                    duesBreakdown: json.duesBreakdown || [], // Mapping ke key yang benar
                    transactions: json.transactions || []
                })
            } catch (err) {
                console.error("Failed to fetch dashboard:", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F9FAFB]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500 font-medium">Memuat dashboard...</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-[#F9FAFB]">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* HEADER */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 md:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Iuran</h1>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input placeholder="Cari grup atau anggota..." className="bg-transparent border-0 text-sm focus-visible:ring-0" />
                            </div>

                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/diverse-avatars.png" />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* RANGE */}
                    <div className="flex items-center gap-2 px-4 md:px-8 pb-4 border-t border-gray-100 pt-2">
                        {["Hari ini", "7 hari", "30 hari", "90 hari", "Semua waktu"].map((range) => (
                            <Button
                                key={range}
                                variant={timeRange === range.toLowerCase().replace(" ", "-") ? "default" : "ghost"}
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => setTimeRange(range.toLowerCase().replace(" ", "-"))}
                            >
                                {range}
                            </Button>
                        ))}
                    </div>
                </header>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 md:p-8 space-y-8">

                        {/* STAT CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Grup"
                                value={data.totalGroups.toString()}
                                icon={<Users className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#3A86FF]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />

                            <StatCard
                                title="Tagihan Saya"
                                value={`Rp ${data.unpaidAmount.toLocaleString("id-ID")}`}
                                icon={<CreditCard className="h-5 w-5" />}
                                trend="↓"
                                bgColor="bg-[#FF6B6B]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />

                            <StatCard
                                title="Status Bayar"
                                value={data.unpaidAmount === 0 ? "Lunas" : "Ada Tagihan"}
                                icon={<TrendingUp className="h-5 w-5" />}
                                trend="-"
                                bgColor="bg-[#10B981]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />

                            <StatCard
                                title="Total Pengeluaran"
                                value={`Rp ${(data.transactions.reduce((t, x) => t + x.amount, 0)).toLocaleString("id-ID")}`}
                                icon={<Plus className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#8B5CF6]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />
                        </div>

                        {/* CHART PAYMENT PROGRESS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <Card className="lg:col-span-2 shadow-md border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Riwayat Pembayaran (30 Hari)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.paymentProgressData.length === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                            <p className="text-gray-400 text-sm">Belum ada aktivitas pembayaran.</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={data.paymentProgressData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                {/* HAPUS tickFormatter karena data sudah string "19 Des" */}
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#9ca3af" 
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis 
                                                    stroke="#9ca3af" 
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                                                />
                                                <Tooltip 
                                                    formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`} 
                                                    labelStyle={{ color: 'black' }}
                                                />
                                                {/* Gunakan dataKey "paid" dan "pending" sesuai log [FINAL] kamu */}
                                                <Bar name="Lunas" dataKey="paid" stackId="a" fill="#3A86FF" radius={[0, 0, 0, 0]} />
                                                <Bar name="Tertunda" dataKey="pending" stackId="a" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* PIE BREAKDOWN */}
                            <Card className="shadow-md border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Jenis Iuran Aktif</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.duesBreakdown.length === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                            <p className="text-gray-400 text-sm">Tidak ada iuran aktif.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-full h-48">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={data.duesBreakdown}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={50}
                                                            outerRadius={70}
                                                            dataKey="amount"
                                                            paddingAngle={5}
                                                        >
                                                            {data.duesBreakdown.map((_, i) => (
                                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="w-full mt-4 space-y-3">
                                                {data.duesBreakdown.map((d, index) => (
                                                    <div key={d.id} className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                            <span className="text-gray-600 truncate max-w-[120px]">{d.name}</span>
                                                        </div>
                                                        <span className="font-semibold">Rp {d.amount.toLocaleString("id-ID")}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* TRANSACTION TABLE */}
                        <Card className="shadow-md border-0 overflow-hidden">
                            <CardHeader className="bg-white border-b border-gray-100">
                                <CardTitle className="text-lg font-bold">10 Transaksi Terakhir</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-left border-b">
                                                <th className="py-4 px-6 font-medium">Invoice</th>
                                                <th className="py-4 px-6 font-medium">Grup</th>
                                                <th className="py-4 px-6 font-medium text-right">Nominal</th>
                                                <th className="py-4 px-6 font-medium">Tanggal</th>
                                                <th className="py-4 px-6 font-medium text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-400">Belum ada riwayat transaksi.</td>
                                                </tr>
                                            ) : (
                                                data.transactions.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 px-6 font-medium text-blue-600">{tx.invoiceCode}</td>
                                                        <td className="py-4 px-6 text-gray-600">{tx.group}</td>
                                                        <td className="py-4 px-6 font-bold text-right">
                                                            Rp {tx.amount.toLocaleString("id-ID")}
                                                        </td>
                                                        <td className="py-4 px-6 text-gray-500">
                                                            {new Date(tx.date).toLocaleDateString("id-ID")}
                                                        </td>
                                                        <td className="py-4 px-6 text-center">
                                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                                tx.status === "Lunas"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                            }`}>
                                                                {tx.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}