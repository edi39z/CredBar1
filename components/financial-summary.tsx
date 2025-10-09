/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, CreditCard, Users, AlertCircle } from "lucide-react"

interface FinancialSummaryProps {
  roomId?: string
}

// Mock financial data
const mockFinancialSummary = {
  totalIncome: 15600000,
  totalExpenses: 12400000,
  netIncome: 3200000,
  totalDues: 18500000,
  paidDues: 15600000,
  pendingDues: 2900000,
  paymentRate: 84.3,
  monthlyGrowth: 12.5,
  totalMembers: 45,
  activeMembers: 42,
  overduePayments: 7,
}

export function FinancialSummary({ roomId }: FinancialSummaryProps) {
  const data = mockFinancialSummary

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Rp {data.totalIncome.toLocaleString("id-ID")}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />+{data.monthlyGrowth}% dari bulan lalu
          </div>
          <Progress value={(data.paidDues / data.totalDues) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Payment Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tingkat Pembayaran</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.paymentRate}%</div>
          <p className="text-xs text-muted-foreground">
            Rp {data.paidDues.toLocaleString("id-ID")} dari Rp {data.totalDues.toLocaleString("id-ID")}
          </p>
          <Progress value={data.paymentRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* Active Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.activeMembers}/{data.totalMembers}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round((data.activeMembers / data.totalMembers) * 100)}% tingkat partisipasi
          </p>
          <Progress value={(data.activeMembers / data.totalMembers) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Pending Dues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Iuran Tertunda</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">Rp {data.pendingDues.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground">{data.overduePayments} pembayaran terlambat</p>
          <div className="flex gap-1 mt-2">
            <Badge variant="outline" className="text-orange-600">
              Perlu Tindakan
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Net Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Rp {data.netIncome.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground">
            Pemasukan - Pengeluaran: Rp {data.totalIncome.toLocaleString("id-ID")} - Rp{" "}
            {data.totalExpenses.toLocaleString("id-ID")}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge className="bg-green-100 text-green-800">Surplus</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tren Bulanan</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+{data.monthlyGrowth}%</div>
          <p className="text-xs text-muted-foreground">Pertumbuhan pemasukan</p>
          <div className="flex gap-1 mt-2">
            <Badge className="bg-green-100 text-green-800">Meningkat</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
