"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 py-4">
            <div className="mx-auto w-full max-w-7xl px-4">
                <div
                    className="flex items-center justify-between rounded-full bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg px-4 md:px-6 h-14"
                    role="navigation"
                    aria-label="Navigasi utama"
                >
                    {/* Brand (left) */}
                    <Link href="/" className="flex items-center gap-2" aria-label="Ke halaman utama">
                        <Image src="/logo.png" alt="Logo CredBar" width={28} height={28} className="object-contain" />
                        <span className="font-semibold font-[family-name:var(--font-poppins)]">CredBar</span>
                    </Link>

                    {/* Center nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                            Beranda
                        </Link>
                        <Link
                            href="/#fitur"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                            Fitur
                        </Link>
                        <Link
                            href="/tutor"
                            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                            Tutorial
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" className="rounded-full px-5">
                            <Link href="/login" aria-label="Masuk ke akun">
                                Login
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
