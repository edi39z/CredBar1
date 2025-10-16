"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === "/" && pathname === "/") return true
        if (href !== "/" && pathname.startsWith(href)) return true
        return false
    }

    const navItems = [
        { label: "Beranda", href: "/" },
        { label: "Fitur", href: "/fitur" },
        { label: "Tutorial", href: "/tutorial" },
    ]

    return (
        <header className="fixed top-0 left-0 z-50 w-full">
            <nav
                className="mx-auto mt-4 w-[92%] max-w-7xl flex items-center justify-between px-6 py-3.5 md:px-8 md:py-4
                   rounded-[200px] bg-gray-100/25 backdrop-blur-xl backdrop-saturate-150 
                   border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] 
                   transition-all duration-500"
                aria-label="Navigasi utama"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="CredBar - Beranda">
                    <div className="relative h-7 w-7 md:h-8 md:w-8">
                        <Image src="/logo.png" alt="Logo CredBar" fill className="object-contain" />
                    </div>
                    <span className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-semibold text-[#2A8757]">
                        CredBar
                    </span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`text-[15px] font-medium transition-all duration-300 
                           ${isActive(item.href)
                                        ? "text-[#2A8757] drop-shadow-[0_0_6px_rgba(42,135,87,0.6)]"
                                        : "text-gray-800 hover:text-[#2A8757] hover:drop-shadow-[0_0_6px_rgba(42,135,87,0.6)]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop Login Button */}
                <div className="hidden md:flex items-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full px-7 py-2.5 text-[15px] font-semibold text-white bg-[#2A8757] 
                       hover:bg-[#256c47] border border-white/30
                       shadow-[0_4px_20px_rgba(42,135,87,0.4)] hover:shadow-[0_0_15px_rgba(42,135,87,0.7)]
                       transition-all duration-300"
                    >
                        <Link href="/login">Mulai Sekarang</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-800 hover:text-[#2A8757] transition-colors"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed top-24 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-4 z-40">
                    <ul className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-300
                               ${isActive(item.href)
                                            ? "bg-[#2A8757]/10 text-[#2A8757]"
                                            : "text-gray-800 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2 border-t border-gray-200">
                            <Button
                                asChild
                                size="lg"
                                className="w-full rounded-full text-[15px] font-semibold text-white bg-[#2A8757] 
                               hover:bg-[#256c47] border border-white/30
                               shadow-[0_4px_20px_rgba(42,135,87,0.4)] hover:shadow-[0_0_15px_rgba(42,135,87,0.7)]
                               transition-all duration-300"
                            >
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    Mulai Sekarang
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Navbar
