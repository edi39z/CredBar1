"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, TrendingUp, FileText, Bell, User, LogOut, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Grup Iuran",
        href: "/dashboard/grup",
        icon: Users,
    },
    {
        name: "Pembayaran",
        href: "/dashboard/pembayaran",
        icon: CreditCard,
    },
    {
        name: "Transaksi",
        href: "/dashboard/transaksi",
        icon: TrendingUp,
    },
    {
        name: "Laporan",
        href: "/dashboard/laporan",
        icon: FileText,
    },
    {
        name: "Notifikasi",
        href: "/dashboard/notifikasi",
        icon: Bell,
    },
    {
        name: "Profil",
        href: "/dashboard/profil",
        icon: User,
    },
]

export function DashboardSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleLogout = () => {
        window.location.href = "/login"
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <Image src="/logo.png" alt="CredBar" width={24} height={24} className="object-contain" />
                            </div>
                            <h2 className="text-lg font-bold text-white">CredBar Iuran</h2>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="px-4 py-6 border-b border-white/20">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white/30">
                                <AvatarImage src="/diverse-avatars.png" />
                                <AvatarFallback className="bg-white/20 text-white font-bold">CM</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Cathy Murray</p>
                                <p className="text-xs text-white/70">ID:5788430</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        isActive ? "bg-white/25 text-white shadow-lg" : "text-white/80 hover:bg-white/15 hover:text-white",
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </div>
                                </a>
                            )
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-white/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-white/15 hover:text-white"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </Button>
                        <p className="text-xs text-white/60 mt-4 text-center">© 2025 CredBar Iuran</p>
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
