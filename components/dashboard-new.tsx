"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Users, CreditCard, TrendingUp, Bell, Settings, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#3A86FF", "#A7F3D0", "#FF6B6B"]

// 1. DEFINISIKAN INTERFACE TIPE DATA
interface Transaction {
  id: string | number
  name: string
  group: string
  amount: number
  date: string
  status: string
}

interface Breakdown {
  name: string
  amount: number
}

interface PaymentProgress {
  date: string
  paid: number
  pending: number
}

interface DashboardData {
  totalGroups: number
  unpaidAmount: number
  paymentProgressData: PaymentProgress[]
  breakdown: Breakdown[]
  transactions: Transaction[]
}

export function DashboardNew() {
    const [timeRange, setTimeRange] = useState("today")
    const [loading, setLoading] = useState(true)

    // 2. GUNAKAN INTERFACE PADA USESTATE
    const [data, setData] = useState<DashboardData>({
        totalGroups: 0,
        unpaidAmount: 0,
        paymentProgressData: [],
        breakdown: [],
        transactions: []
    })

    // ================================
    // Fetch REAL DATA from API
    // ================================
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/dashboard")
                const json = await res.json()
                setData(json)
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
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading dashboard...</p>
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
                                <Input placeholder="Cari grup atau anggota..." className="bg-transparent border-0 text-sm" />
                            </div>

                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/diverse-avatars.png" />
                                <AvatarFallback>CM</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* RANGE */}
                    <div className="flex items-center gap-2 px-4 md:px-8 pb-4 border-t border-gray-100">
                        {["Hari ini", "7 hari", "30 hari", "90 hari", "Semua waktu"].map((range) => (
                            <Button
                                key={range}
                                variant={timeRange === range.toLowerCase().replace(" ", "-") ? "default" : "ghost"}
                                size="sm"
                                className="text-xs"
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
                                title="Tagihan Tertunda"
                                value={`Rp ${data.unpaidAmount.toLocaleString("id-ID")}`}
                                icon={<CreditCard className="h-5 w-5" />}
                                trend="↓"
                                bgColor="bg-[#FF6B6B]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />

                            <StatCard
                                title="Pembayaran Lunas"
                                value={`${Math.floor(Math.random() * 20) + 80}%`}
                                icon={<TrendingUp className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#10B981]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />

                            <StatCard
                                title="Total Terkumpul"
                                // TypeScript sekarang tahu bahwa 'x' memiliki properti 'amount'
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

                            <Card className="lg:col-span-2 shadow-lg border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Progress Pembayaran Mingguan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.paymentProgressData.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Belum ada data pembayaran.</p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={data.paymentProgressData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="date" stroke="#9ca3af" />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip />
                                                <Bar dataKey="paid" stackId="a" fill="#3A86FF" />
                                                <Bar dataKey="pending" stackId="a" fill="#FF6B6B" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* PIE BREAKDOWN */}
                            <Card className="shadow-lg border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Breakdown Iuran</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.breakdown.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Belum ada iuran terdaftar.</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-40 h-40">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={data.breakdown}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            dataKey="amount"
                                                        >
                                                            {data.breakdown.map((_, i) => (
                                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="w-full mt-4 space-y-2">
                                                {data.breakdown.map((d, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                            <span>{d.name}</span>
                                                        </div>
                                                        <span>Rp {d.amount.toLocaleString("id-ID")}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* TRANSACTION TABLE */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Riwayat Transaksi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-3 px-4">No</th>
                                                <th className="py-3 px-4">Nama</th>
                                                <th className="py-3 px-4">Grup</th>
                                                <th className="py-3 px-4">Nominal</th>
                                                <th className="py-3 px-4">Tanggal</th>
                                                <th className="py-3 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.transactions.map((tx, i) => (
                                                <tr key={tx.id} className="border-b border-gray-100">
                                                    <td className="py-3 px-4">{i + 1}</td>
                                                    <td className="py-3 px-4">{tx.name}</td>
                                                    <td className="py-3 px-4">{tx.group}</td>
                                                    <td className="py-3 px-4 font-semibold">
                                                        Rp {tx.amount.toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {new Date(tx.date).toLocaleDateString("id-ID")}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 text-xs rounded-full ${
                                                            tx.status === "Lunas"
                                                                ? "bg-green-200 text-green-700"
                                                                : "bg-red-200 text-red-700"
                                                        }`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
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