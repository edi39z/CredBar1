import { CheckCircle, Clock, AlertCircle, Edit2 } from "lucide-react"

export interface Invoice {
  id: string
  code: string
  memberId: string | number // Support string/number agar fleksibel
  dueId?: number
  description?: string
  amount: number | string
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE"
  dueDate: string
  paidDate?: string
  paymentMethod?: string
  member?: {
    id: number
    name: string
    email: string
  }
  payments: Array<{
    id: number
    amount: number
    method: string
    paidAt: string
  }>
}

export interface Due {
  id: number
  name: string
  description?: string
  amount: number | string
  accountNumber?: string // <--- Field baru ditambahkan disini
  isRecurring: boolean
  frequency?: string
  interval?: number
  startDate?: string
  nextDueDate?: string
  isActive: boolean
  createdAt?: string
  invoices: Invoice[]
}

export interface RoomMember {
  id: string
  userId: number
  roomId: number
  user: {
    id: number
    name: string
    email: string
  }
  status: string
}

export const getStatusColor = (status: Invoice["status"]) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700"
    case "PENDING":
      return "bg-yellow-100 text-yellow-700"
    case "OVERDUE":
    case "DRAFT":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export const getStatusLabel = (status: Invoice["status"]) => {
  switch (status) {
    case "PAID":
      return "Lunas"
    case "PENDING":
      return "Menunggu Konfirmasi"
    case "OVERDUE":
      return "Terlambat"
    case "DRAFT":
      return "Draft"
    default:
      return status
  }
}

export const getStatusIcon = (status: Invoice["status"]) => {
  switch (status) {
    case "PAID":
      return <CheckCircle size={16} />
    case "PENDING":
      return <Clock size={16} />
    case "OVERDUE":
      return <AlertCircle size={16} />
    case "DRAFT":
      return <Edit2 size={16} />
    default:
      return null
  }
}