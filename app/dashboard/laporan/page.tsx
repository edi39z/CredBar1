"use client"

import { useState } from "react"
import { Download, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function LaporanPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("bulan")

  const monthlyData = [
    { bulan: "Agustus", masuk: 500000, keluar: 250000 },
    { bulan: "September", masuk: 750000, keluar: 400000 },
    { bulan: "Oktober", masuk: 900000, keluar: 500000 },
    { bulan: "November", masuk: 1200000, keluar: 600000 },
  ]

  const groupData = [
    { name: "Iuran WiFi Kos", value: 250000 },
    { name: "Arisan Bulanan", value: 400000 },
    { name: "Iuran Listrik", value: 150000 },
    { name: "Iuran Kebersihan", value: 100000 },
  ]

  const COLORS = ["#3A86FF", "#A7F3D0", "#8B5CF6", "#FF6B6B"]

  const stats = [
    {
      label: "Total Pemasukan",
      value: "Rp 3.350.000",
      change: "+12%",
      color: "bg-green-500",
    },
    {
      label: "Total Pengeluaran",
      value: "Rp 1.750.000",
      change: "+5%",
      color: "bg-red-500",
    },
    {
      label: "Saldo Bersih",
      value: "Rp 1.600.000",
      change: "+18%",
      color: "bg-blue-500",
    },
    {
      label: "Rata-rata Transaksi",
      value: "Rp 156.250",
      change: "+8%",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-600 mt-2">Analisis keuangan dan performa grup iuran</p>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 w-full md:w-auto">
            <Download size={20} />
            Export Laporan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-white rounded-xl shadow-md border-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm font-semibold mt-2">{stat.change} dari bulan lalu</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg opacity-20`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pemasukan vs Pengeluaran</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bulan" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="masuk" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="keluar" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Iuran per Grup</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={groupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: Rp ${value.toLocaleString("id-ID")}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {groupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Report Table */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Ringkasan Transaksi Bulanan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bulan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pemasukan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pengeluaran</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Saldo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Perubahan</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.bulan}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rp {data.masuk.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      Rp {data.keluar.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      Rp {(data.masuk - data.keluar).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <TrendingUp size={16} />
                        +12%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
