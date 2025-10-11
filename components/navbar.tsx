"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-4 z-50">
            {/* 🌫️ Glass Navbar putih elegan */}
            <nav
                className="mx-auto w-[92%] max-w-7xl rounded-[24px]
                bg-white/25 backdrop-blur-2xl backdrop-saturate-200
                border border-white/30 shadow-[0_6px_24px_rgba(0,0,0,0.06)]
                transition-all duration-500 ease-in-out"
                aria-label="Navigasi utama"
            >
                <div className="flex items-center justify-between px-5 py-3 md:px-8 md:py-4">
                    {/* Brand */}
                    <Link href="/" className="inline-flex items-center gap-2" aria-label="CredBar - Beranda">
                        <div className="relative h-8 w-8 md:h-9 md:w-9">
                            <Image src="/logo.png" alt="Logo CredBar" fill className="object-contain" />
                        </div>
                        <span className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-bold text-[#2A8757] drop-shadow-sm">
                            CredBar
                        </span>
                    </Link>

                    {/* Menu Navigasi */}
                    <ul className="hidden md:flex items-center gap-8">
                        {["Beranda", "Fitur", "Tutorial"].map((item, i) => (
                            <li key={i}>
                                <Link
                                    href={item === "Beranda" ? "/" : item === "Fitur" ? "#fitur" : "#tutorial"}
                                    className="text-sm font-semibold text-gray-800/80
                                    transition-all duration-300 ease-in-out
                                    hover:text-[#2A8757]
                                    hover:drop-shadow-[0_0_8px_rgba(42,135,87,0.6)]
                                    hover:scale-[1.03]"
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
                            size="sm"
                            className="rounded-full px-6 py-2 
                            font-semibold text-white 
                            bg-[#2A8757]/70 border border-white/30
                            shadow-[0_4px_20px_rgba(0,0,0,0.1)]
                            backdrop-blur-md transition-all duration-300
                            hover:bg-[#2A8757]
                            hover:shadow-[0_0_20px_rgba(42,135,87,0.5)]
                            active:scale-95"
                        >
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
