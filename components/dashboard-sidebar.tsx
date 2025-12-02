"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    CreditCard,
    TrendingUp,
    FileText,
    Bell,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Grup Iuran", href: "/dashboard/grup", icon: Users },
    { name: "Pembayaran", href: "/dashboard/pembayaran", icon: CreditCard },
    { name: "Transaksi", href: "/dashboard/transaksi", icon: TrendingUp },
    { name: "Laporan", href: "/dashboard/laporan", icon: FileText },
    { name: "Notifikasi", href: "/dashboard/notifikasi", icon: Bell },
    { name: "Profil", href: "/dashboard/profil", icon: User },
]

export function DashboardSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleLogout = async () => {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
        })
        window.location.href = "/login" // redirect setelah token dihapus
    } catch (error) {
        console.error("Logout gagal:", error)
    }
}


    return (
        <>
            {/* Tombol menu mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5 text-[#2563EB]" />
                    ) : (
                        <Menu className="h-5 w-5 text-[#2563EB]" />
                    )}
                </Button>
            </div>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#3A86FF] to-[#2563EB] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-center h-20 px-4 border-b border-white/20">
                        <div className="bg-white px-3 py-2 rounded-xl shadow-sm flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="CredBar"
                                    width={34}
                                    height={34}
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-base font-semibold text-[#10B981]">CredBar</h2>
                        </div>
                    </div>

                    {/* Navigasi */}
                    <nav className="flex-1 px-3 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-white/25 text-white shadow-lg"
                                            : "text-white/80 hover:bg-white/15 hover:text-white",
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Tambahkan warna eksplisit pada ikon */}
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                isActive ? "text-white" : "text-white/80 group-hover:text-white",
                                            )}
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                </a>
                            )
                        })}
                    </nav>

                    {/* Tombol Logout */}
                    <div className="p-4 border-t border-white/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white/15 hover:text-white"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5 text-white" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay untuk mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
