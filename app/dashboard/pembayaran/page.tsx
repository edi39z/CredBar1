"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

interface Payment {
  id: string
  amount: string
  paidAt: string | null
  invoiceCode: string | null
  invoiceStatus: "PAID" | "PENDING" | "OVERDUE" | "DRAFT" | null
  groupName: string | null
  memberName: string | null
  createdByName: string | null
}

export default function PembayaranPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"semua" | "PAID" | "PENDING" | "OVERDUE">("semua")

  useEffect(() => {
    fetchPayments()
  }, [])

const fetchPayments = async () => {
  try {
    setLoading(true)
    const res = await fetch("/api/payments")
    const data = await res.json()
    
    // Langsung set data karena response adalah Array []
    setPayments(Array.isArray(data) ? data : [])
  } catch (err) {
    setError("Gagal memuat data")
  } finally {
    setLoading(false)
  }
}

  const filteredPayments =
    filterStatus === "semua" ? payments : payments.filter((p) => p.invoiceStatus === filterStatus)

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-300"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status?: string | null) => {
    switch (status) {
      case "PAID":
        return <CheckCircle size={20} className="text-green-600" />
      case "PENDING":
        return <Clock size={20} className="text-yellow-600" />
      case "OVERDUE":
        return <AlertCircle size={20} className="text-red-600" />
      default:
        return <FileText size={20} className="text-gray-600" />
    }
  }

  const getStatusLabel = (status?: string | null) => {
    switch (status) {
      case "PAID":
        return "Lunas"
      case "PENDING":
        return "Menunggu"
      case "OVERDUE":
        return "Terlambat"
      case "DRAFT":
        return "Draft"
      default:
        return "-"
    }
  }

  const stats = [
    {
      label: "Total Pembayaran",
      value: payments.length,
      color: "bg-blue-500",
      icon: "📊",
    },
    {
      label: "Lunas",
      value: payments.filter((p) => p.invoiceStatus === "PAID").length,
      color: "bg-green-500",
      icon: "✓",
    },
    {
      label: "Menunggu",
      value: payments.filter((p) => p.invoiceStatus === "PENDING").length,
      color: "bg-yellow-500",
      icon: "⏳",
    },
    {
      label: "Terlambat",
      value: payments.filter((p) => p.invoiceStatus === "OVERDUE").length,
      color: "bg-red-500",
      icon: "⚠️",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="bg-white rounded-2xl shadow-lg border-0 p-6 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchPayments} className="bg-blue-500 hover:bg-blue-600 text-white">
              Coba Lagi
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manajemen Pembayaran</h1>
          <p className="text-gray-600 mt-2">Pantau status pembayaran iuran semua anggota</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-white rounded-xl shadow-md border-0 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["semua", "PAID", "PENDING", "OVERDUE"] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`capitalize ${
                filterStatus === status
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status === "semua"
                ? "Semua"
                : status === "PAID"
                  ? "Lunas"
                  : status === "PENDING"
                    ? "Menunggu"
                    : "Terlambat"}
            </Button>
          ))}
        </div>

        {filteredPayments.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-lg border-0 p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
              <p className="text-gray-600">Belum ada pembayaran yang tercatat</p>
            </div>
          </Card>
        ) : (
          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Invoice</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nama Anggota</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Grup</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nominal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Bayar</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.invoiceCode ?? "-"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.memberName ?? "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.groupName ?? "-"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Rp {Number(p.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                            p.invoiceStatus,
                          )}`}
                        >
                          {getStatusIcon(p.invoiceStatus)}
                          <span className="text-xs font-semibold">{getStatusLabel(p.invoiceStatus)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
