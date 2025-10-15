"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Instagram, Twitter } from "lucide-react"

export function SiteFooter() {
    return (
        <footer
            aria-label="Footer"
            className="relative mt-20 border-t border-slate-100 bg-gradient-to-tr from-[#10B981]/10 via-[#8B5CF6]/10 to-[#3A86FF]/10 py-12"
        >
            {/* Aksen background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/10 via-[#8B5CF6]/15 to-[#3A86FF]/10 blur-2xl opacity-70" />

            <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* Brand + tagline */}
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/logo.png" alt="CredBar logo" width={36} height={36} />
                            <span className="text-lg font-bold text-slate-900">CredBar</span>
                        </Link>
                        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                            Smart finance untuk anak muda modern. Kelola iuran, patungan, dan utang dengan cara transparan,
                            aman, dan menyenangkan.
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav aria-label="Footer Navigation">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                            Navigasi
                        </h3>
                        <ul className="mt-4 space-y-2 text-[15px] font-medium">
                            <li>
                                <Link
                                    href="/"
                                    className="text-slate-700 hover:text-[#10B981] transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#features"
                                    className="text-slate-700 hover:text-[#8B5CF6] transition-colors"
                                >
                                    Fitur
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tutorial"
                                    className="text-slate-700 hover:text-[#3A86FF] transition-colors"
                                >
                                    Tutorial
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-slate-700 hover:text-[#10B981] transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="text-slate-700 hover:text-[#8B5CF6] transition-colors"
                                >
                                    Daftar
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Contact + social */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                            Butuh Bantuan?
                        </h3>
                        <p className="mt-4 text-[15px] text-slate-700">
                            Kirim pesan ke{" "}
                            <a
                                href="mailto:hello@credbar.app"
                                className="text-[#3A86FF] underline underline-offset-4 hover:text-[#8B5CF6]"
                            >
                                credbar@gmail.com
                            </a>
                        </p>

                        <div className="mt-5 flex items-center gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter"
                                className="rounded-full bg-[#3A86FF]/10 p-3 text-[#3A86FF] hover:bg-[#3A86FF]/20 transition"
                            >
                                <Twitter className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="rounded-full bg-[#8B5CF6]/10 p-3 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition"
                            >
                                <Instagram className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a
                                href="mailto:hello@credbar.app"
                                aria-label="Email"
                                className="rounded-full bg-[#10B981]/10 p-3 text-[#10B981] hover:bg-[#10B981]/20 transition"
                            >
                                <Mail className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider + copyright */}
                <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} <span className="font-semibold text-slate-700">CredBar</span>. Semua hak dilindungi.
                </div>
            </div>
        </footer>
    )
}
