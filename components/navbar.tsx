"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-4 z-50">
            {/* Glass navbar without outline/border; stronger drop shadow for glass feel */}
            <nav
                className="mx-auto w-[92%] max-w-7xl rounded-[28px] bg-white/65 backdrop-blur-xl
                   shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
                aria-label="Navigasi utama"
            >
                <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                    {/* Brand */}
                    <Link href="/" className="inline-flex items-center gap-3" aria-label="CredBar - Beranda">
                        <div className="relative h-8 w-8 md:h-9 md:w-9">
                            <Image src="/logo.png" alt="Logo CredBar" fill className="object-contain" />
                        </div>
                        <span className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-bold text-foreground">
                            CredBar
                        </span>
                    </Link>

                    {/* Nav center */}
                    <ul className="hidden md:flex items-center gap-8">
                        <li>
                            <Link href="/" className="font-semibold text-foreground hover:text-foreground/70 transition-colors">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link href="#fitur" className="font-semibold text-foreground hover:text-foreground/70 transition-colors">
                                Fitur
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#tutorial"
                                className="font-semibold text-foreground hover:text-foreground/70 transition-colors"
                            >
                                Tutorial
                            </Link>
                        </li>
                    </ul>

                    {/* Login button */}
                    {/* Remove outline on button; emphasize drop shadow */}
                    <div className="flex items-center gap-3">
                        <Button asChild variant="glass" className="rounded-full px-5 border-none shadow-md hover:shadow-lg">
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
