"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "Jan", valid: 85, invalid: 12, pending: 23 },
  { month: "Feb", valid: 92, invalid: 8, pending: 18 },
  { month: "Mar", valid: 78, invalid: 15, pending: 31 },
  { month: "Apr", valid: 105, invalid: 6, pending: 25 },
  { month: "May", valid: 118, invalid: 9, pending: 19 },
  { month: "Jun", valid: 134, invalid: 4, pending: 27 },
]

const statusData = [
  { name: "Valid", value: 1089, color: "hsl(var(--accent))" },
  { name: "Pending", value: 127, color: "hsl(var(--warning))" },
  { name: "Invalid", value: 31, color: "hsl(var(--destructive))" },
]

const recentCustomers = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@email.com",
    agent: "Siti Agent",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Maya Sari",
    email: "maya.sari@email.com",
    agent: "Budi Agent",
    status: "pending",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Rudi Hermawan",
    email: "rudi.hermawan@email.com",
    agent: "Ani Agent",
    status: "pending",
    createdAt: "2024-01-13",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "valid":
      return <Badge className="bg-accent text-accent-foreground">Valid</Badge>
    case "pending":
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
    case "invalid":
      return <Badge variant="destructive">Invalid</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function AdminOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Statistik Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="valid" fill="hsl(var(--accent))" name="Valid" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" radius={[4, 4, 0, 0]} />
              <Bar dataKey="invalid" fill="hsl(var(--destructive))" name="Invalid" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Distribusi Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Review Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">Agent: {customer.agent}</p>
                </div>
                {getStatusBadge(customer.status)}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4 border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Lihat Semua Pending
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Metrik Performa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Tingkat Validasi</span>
                <span className="text-sm font-bold text-accent">87%</span>
              </div>
              <Progress value={87} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Efisiensi Review</span>
                <span className="text-sm font-bold text-secondary">92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Kualitas Data</span>
                <span className="text-sm font-bold text-primary">95%</span>
              </div>
              <Progress value={95} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
