export interface IuranMember {
    id: string
    memberId: string
    nama: string
    nominal: number
    status: "lunas" | "menunggu_konfirmasi" | "belum_bayar"
    tanggalBayar?: string
    buktiPembayaran?: string
    catatan?: string
}

export interface Iuran {
    id: string
    judul: string
    deskripsi: string
    nominalTotal: number
    nomorRekening: string
    qrCode?: string
    tanggalJatuhTempo: string
    members: IuranMember[]
    createdAt: string
    grupNama?: string
    role?: "admin" | "member"
}

export interface IuranFormData {
    judul: string
    deskripsi: string
    nominalTotal: string
    nomorRekening: string
    tanggalJatuhTempo: string
}

export interface IuranPaymentForm {
    nominal: string
    catatan: string
    buktiPembayaran: string
}
