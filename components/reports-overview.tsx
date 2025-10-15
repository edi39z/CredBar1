/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, CreditCard, DollarSign, Download, Home, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

const monthlyFinancialData = [
  { month: "Jan", income: 12500000, expenses: 8500000, dues: 15000000, paid: 12500000 },
  { month: "Feb", income: 14200000, expenses: 9200000, dues: 16500000, paid: 14200000 },
  { month: "Mar", income: 13800000, expenses: 8800000, dues: 15800000, paid: 13800000 },
  { month: "Apr", income: 15600000, expenses: 10200000, dues: 18200000, paid: 15600000 },
  { month: "May", income: 16800000, expenses: 11000000, dues: 19500000, paid: 16800000 },
  { month: "Jun", income: 18200000, expenses: 12100000, dues: 21000000, paid: 18200000 },
]

const roomPerformanceData = [
  { room: "Kos Mawar", members: 8, totalDues: 2400000, paidRate: 95, pendingPayments: 1 },
  { room: "Arisan Keluarga", members: 12, totalDues: 1800000, paidRate: 100, pendingPayments: 0 },
  { room: "Tim Futsal", members: 15, totalDues: 1125000, paidRate: 87, pendingPayments: 2 },
  { room: "Komunitas Hobi", members: 6, totalDues: 900000, paidRate: 92, pendingPayments: 1 },
  { room: "Keluarga Besar", members: 20, totalDues: 3000000, paidRate: 89, pendingPayments: 3 },
]

const paymentMethodData = [
  { name: "Transfer Bank", value: 45, color: "hsl(var(--chart-1))" },
  { name: "E-Wallet", value: 32, color: "hsl(var(--chart-2))" },
  { name: "Tunai", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Lainnya", value: 5, color: "hsl(var(--chart-4))" },
]

const duesTypeData = [
  { type: "Listrik", amount: 4500000 },
  { type: "WiFi", amount: 2250000 },
  { type: "Air", amount: 1500000 },
  { type: "Kebersihan", amount: 750000 },
  { type: "Keamanan", amount: 1200000 },
  { type: "Lainnya", amount: 800000 },
]

const weeklyActivityData = [
  { week: "W1", invoices: 23, payments: 18, reminders: 5 },
  { week: "W2", invoices: 28, payments: 25, reminders: 3 },
  { week: "W3", invoices: 31, payments: 27, reminders: 8 },
  { week: "W4", invoices: 25, payments: 23, reminders: 4 },
]

export function ReportsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")
  const [selectedRoom, setSelectedRoom] = useState("all")

  const totalIncome = monthlyFinancialData.reduce((sum, month) => sum + month.income, 0)
  const totalExpenses = monthlyFinancialData.reduce((sum, month) => sum + month.expenses, 0)
  const totalDues = monthlyFinancialData.reduce((sum, month) => sum + month.dues, 0)
  const totalPaid = monthlyFinancialData.reduce((sum, month) => sum + month.paid, 0)
  const paymentRate = Math.round((totalPaid / totalDues) * 100)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="Laporan & Analitik"
        subtitle="Analisis keuangan dan performa room"
        backHref="/dashboard"
        rightActions={
          <Button variant="glass-outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        }
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="rooms">Performa Room</TabsTrigger>
            <TabsTrigger value="trends">Tren & Analisis</TabsTrigger>
          </TabsList>

          {/* Report Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                      <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Room</SelectItem>
                      <SelectItem value="kos">Kos Mawar</SelectItem>
                      <SelectItem value="arisan">Arisan Keluarga</SelectItem>
                      <SelectItem value="futsal">Tim Futsal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString("id-ID")}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    +12% dari periode sebelumnya
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Pembayaran</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentRate}%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    +3.2% dari bulan lalu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Room</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roomPerformanceData.length}</div>
                  <p className="text-xs text-muted-foreground">Room aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pembayaran Tertunda</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {roomPerformanceData.reduce((sum, room) => sum + room.pendingPayments, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Perlu ditindaklanjuti</p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Keuangan Bulanan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyFinancialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
                      labelFormatter={(label) => `Bulan ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="dues"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      name="Total Iuran"
                    />
                    <Area
                      type="monotone"
                      dataKey="paid"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      name="Terbayar"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {paymentMethodData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dues by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Iuran Berdasarkan Jenis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={duesTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Total"]} />
                      <Bar dataKey="amount" fill="hsl(var(--chart-3))" name="Jumlah" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            {/* Room Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performa Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomPerformanceData.map((room) => (
                    <div key={room.room} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{room.room}</h4>
                        <p className="text-sm text-muted-foreground">{room.members} anggota</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Rp {room.totalDues.toLocaleString("id-ID")}</p>
                          <p className="text-xs text-muted-foreground">Total iuran</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              room.paidRate >= 95
                                ? "bg-green-100 text-green-800"
                                : room.paidRate >= 80
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {room.paidRate}%
                          </Badge>
                          <p className="text-xs text-muted-foreground">Tingkat bayar</p>
                        </div>
                        {room.pendingPayments > 0 && (
                          <div className="text-right">
                            <span className="text-sm font-medium text-orange-600">{room.pendingPayments}</span>
                            <p className="text-xs text-muted-foreground">Tertunda</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="invoices"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Invoice Dibuat"
                    />
                    <Line
                      type="monotone"
                      dataKey="payments"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Pembayaran"
                    />
                    <Line
                      type="monotone"
                      dataKey="reminders"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      name="Pengingat"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
