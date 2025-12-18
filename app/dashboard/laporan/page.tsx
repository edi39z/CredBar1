"use client"

import { useState, useEffect } from "react"
import { Download, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
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

// ... interface ReportData tetap sama ...
interface ReportData {
  stats: { label: string; value: string; change: string; color: string }[]
  monthlyData: { bulan: string; masuk: number; keluar: number }[]
  groupData: { name: string; value: number }[]
}

export default function LaporanPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const COLORS = ["#3A86FF", "#A7F3D0", "#8B5CF6", "#FF6B6B"]

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true)
        const response = await fetch("/api/reports")
        if (!response.ok) throw new Error("Gagal mengambil data laporan")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError("Gagal memuat laporan keuangan")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  // FUNGSI DOWNLOAD PDF
  const handleDownloadPDF = () => {
    if (!data) return

    const doc = new jsPDF()
    const date = new Date().toLocaleDateString("id-ID")

    // Header PDF
    doc.setFontSize(18)
    doc.text("Laporan Keuangan Iuran", 14, 20)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Dicetak pada: ${date}`, 14, 28)

    // Ringkasan Statistik
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Ringkasan Eksekutif", 14, 40)
    
    let yPos = 48
    data.stats.forEach((stat) => {
      doc.setFontSize(10)
      doc.text(`${stat.label}: ${stat.value}`, 14, yPos)
      yPos += 7
    })

    // Tabel Rincian Bulanan
    doc.setFontSize(14)
    doc.text("Rincian Transaksi Bulanan", 14, yPos + 10)

    const tableRows = data.monthlyData.map((m) => [
      m.bulan,
      `Rp ${m.masuk.toLocaleString("id-ID")}`,
      `Rp ${m.keluar.toLocaleString("id-ID")}`,
      `Rp ${(m.masuk - m.keluar).toLocaleString("id-ID")}`,
    ])

    autoTable(doc, {
      startY: yPos + 15,
      head: [["Bulan", "Pemasukan", "Pengeluaran", "Saldo Bersih"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [58, 134, 255] }, // Warna Blue-500
    })

    // Simpan PDF
    doc.save(`Laporan_Keuangan_${date.replace(/\//g, "-")}.pdf`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-50"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
  if (error || !data) return <div className="min-h-screen flex items-center justify-center bg-blue-50">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-600 mt-2">Analisis keuangan dan performa grup iuran</p>
          </div>
          {/* ACTION: DOWNLOAD PDF */}
          <Button 
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 w-full md:w-auto"
          >
            <Download size={20} />
            Export PDF
          </Button>
        </div>

        {/* ... Stats Cards & Charts (Kode UI sebelumnya tetap sama) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {data.stats.map((stat, idx) => (
            <Card key={idx} className="bg-white rounded-xl shadow-md border-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm font-semibold mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg opacity-20`} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pemasukan vs Pengeluaran</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bulan" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                <Legend />
                <Bar dataKey="masuk" fill="#10B981" radius={[8, 8, 0, 0]} name="Pemasukan" />
                <Bar dataKey="keluar" fill="#FF6B6B" radius={[8, 8, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Iuran per Grup</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.groupData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.groupData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Ringkasan Transaksi Bulanan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Bulan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pemasukan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pengeluaran</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyData.map((m, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-sm font-medium">{m.bulan}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">Rp {m.masuk.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-semibold">Rp {m.keluar.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold">Rp {(m.masuk - m.keluar).toLocaleString("id-ID")}</td>
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