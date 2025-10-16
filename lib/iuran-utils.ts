import type { Iuran, IuranMember } from "./iuran-types"

export const calculateIuranStats = (iuran: Iuran) => {
    const lunas = iuran.members.filter((m) => m.status === "lunas").length
    const menunggu = iuran.members.filter((m) => m.status === "menunggu_konfirmasi").length
    const belumBayar = iuran.members.filter((m) => m.status === "belum_bayar").length
    const total = iuran.members.length

    const totalLunas = iuran.members.filter((m) => m.status === "lunas").reduce((sum, m) => sum + m.nominal, 0)

    const totalBelumBayar = iuran.members.filter((m) => m.status !== "lunas").reduce((sum, m) => sum + m.nominal, 0)

    const progress = total > 0 ? (lunas / total) * 100 : 0

    return {
        lunas,
        menunggu,
        belumBayar,
        total,
        totalLunas,
        totalBelumBayar,
        progress,
    }
}

export const getStatusColor = (status: IuranMember["status"]) => {
    switch (status) {
        case "lunas":
            return "bg-green-100 text-green-800"
        case "menunggu_konfirmasi":
            return "bg-yellow-100 text-yellow-800"
        case "belum_bayar":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export const getStatusLabel = (status: IuranMember["status"]) => {
    switch (status) {
        case "lunas":
            return "Lunas"
        case "menunggu_konfirmasi":
            return "Menunggu Konfirmasi"
        case "belum_bayar":
            return "Belum Bayar"
        default:
            return "Unknown"
    }
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}
