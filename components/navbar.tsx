"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
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
                <Link href="/" className="flex items-center gap-2" aria-label="CredBar - Beranda">
                    <div className="relative h-7 w-7 md:h-8 md:w-8">
                        <Image src="/logo.png" alt="Logo CredBar" fill className="object-contain" />
                    </div>
                    <span className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-semibold text-[#2A8757]">
                        CredBar
                    </span>
                </Link>

                {/* Menu */}
                <ul className="hidden md:flex items-center gap-8">
                    {["Beranda", "Fitur", "Tutorial"].map((item, i) => (
                        <li key={i}>
                            <Link
                                href={item === "Beranda" ? "/" : item === "Fitur" ? "#fitur" : "#tutorial"}
                                className="text-[15px] font-medium text-gray-800 transition-all duration-300 
                           hover:text-[#2A8757] hover:drop-shadow-[0_0_6px_rgba(42,135,87,0.6)]"
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Tombol Login */}
                <div className="flex items-center gap-3">
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
            </nav>
        </header>
    )
}

export default Navbar
