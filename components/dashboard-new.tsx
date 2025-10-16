"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Users, CreditCard, TrendingUp, Bell, Settings, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const paymentProgressData = [
    { date: "Minggu 1", paid: 8, pending: 2, total: 10 },
    { date: "Minggu 2", paid: 9, pending: 1, total: 10 },
    { date: "Minggu 3", paid: 7, pending: 3, total: 10 },
    { date: "Minggu 4", paid: 10, pending: 0, total: 10 },
    { date: "Minggu 5", paid: 8, pending: 2, total: 10 },
    { date: "Minggu 6", paid: 9, pending: 1, total: 10 },
    { date: "Minggu 7", paid: 10, pending: 0, total: 10 },
]

const iuranBreakdownData = [
    { name: "Iuran WiFi", value: 45.2, amount: 1356000 },
    { name: "Iuran Kos", value: 32.1, amount: 963000 },
    { name: "Iuran Sosial", value: 22.7, amount: 681000 },
]

const transactionData = [
    { id: 1, name: "Ahmad Rizki", group: "Kos Mawar", amount: 250000, date: "2025-01-15", status: "Lunas" },
    { id: 2, name: "Budi Santoso", group: "Arisan Keluarga", amount: 150000, date: "2025-01-14", status: "Menunggu" },
    { id: 3, name: "Citra Dewi", group: "Tim Futsal", amount: 100000, date: "2025-01-13", status: "Lunas" },
    { id: 4, name: "Doni Hermawan", group: "Kos Mawar", amount: 250000, date: "2025-01-12", status: "Lunas" },
]

const COLORS = ["#3A86FF", "#A7F3D0", "#FF6B6B"]

export function DashboardNew() {
    const [timeRange, setTimeRange] = useState("today")

    return (
        <div className="flex h-screen bg-[#F9FAFB]">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 md:px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Iuran</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari grup atau anggota..."
                                    className="bg-transparent border-0 text-sm focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
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
                    </div>

                    {/* Time Range Selector */}
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

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 md:p-8 space-y-8">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Grup"
                                value="12"
                                icon={<Users className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#3A86FF]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />
                            <StatCard
                                title="Tagihan Tertunda"
                                value="Rp 2.5M"
                                icon={<CreditCard className="h-5 w-5" />}
                                trend="↓"
                                bgColor="bg-[#FF6B6B]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />
                            <StatCard
                                title="Pembayaran Lunas"
                                value="87%"
                                icon={<TrendingUp className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#10B981]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />
                            <StatCard
                                title="Total Terkumpul"
                                value="Rp 15.2M"
                                icon={<Plus className="h-5 w-5" />}
                                trend="↑"
                                bgColor="bg-[#8B5CF6]"
                                textColor="text-white"
                                iconBgColor="bg-white/20"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Payment Progress Chart */}
                            <Card className="lg:col-span-2 shadow-lg border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Progress Pembayaran Mingguan</CardTitle>
                                    <div className="flex gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#3A86FF]"></div>
                                            <span className="text-xs text-gray-600">Sudah Bayar</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
                                            <span className="text-xs text-gray-600">Belum Bayar</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={paymentProgressData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar dataKey="paid" stackId="a" fill="#3A86FF" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="pending" stackId="a" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Iuran Breakdown Pie Chart */}
                            <Card className="shadow-lg border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Breakdown Iuran</CardTitle>
                                    <p className="text-sm text-gray-600 mt-2">Total: Rp 3M</p>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <div className="relative w-40 h-40">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={iuranBreakdownData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {iuranBreakdownData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <p className="text-2xl font-bold text-gray-900">Rp 3M</p>
                                            <p className="text-xs text-gray-600">Total</p>
                                        </div>
                                    </div>
                                    <div className="w-full mt-6 space-y-2">
                                        {iuranBreakdownData.map((item, index) => (
                                            <div key={item.name} className="flex justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                    <span className="text-gray-700">{item.name}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.value}%</p>
                                                    <p className="text-xs text-gray-500">Rp {(item.amount / 1000000).toFixed(1)}M</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Transaction History Table */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold">Riwayat Transaksi Terbaru</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                                        Lihat semua →
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">No</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Anggota</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Grup</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nominal</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactionData.map((transaction) => (
                                                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-900">{transaction.id}</td>
                                                    <td className="py-3 px-4 text-gray-900 font-medium">{transaction.name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{transaction.group}</td>
                                                    <td className="py-3 px-4 text-gray-900 font-semibold">
                                                        Rp {transaction.amount.toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "Lunas"
                                                                    ? "bg-[#A7F3D0] text-[#10B981]"
                                                                    : "bg-[#FFE5E5] text-[#FF6B6B]"
                                                                }`}
                                                        >
                                                            {transaction.status}
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
