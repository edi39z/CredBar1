/* eslint-disable react/no-unescaped-entities */
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export function Hero() {
    const sectionRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const root = sectionRef.current
        if (!root) return

        const targets = Array.from(root.querySelectorAll<HTMLElement>(".proximity-glow"))

        let rafId: number | null = null
        const RADIUS_PX = 240

        const handleMove = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                const { clientX, clientY } = e
                targets.forEach((el) => {
                    const rect = el.getBoundingClientRect()
                    const cx = rect.left + rect.width / 2
                    const cy = rect.top + rect.height / 2
                    const dx = clientX - cx
                    const dy = clientY - cy
                    const dist = Math.hypot(dx, dy)

                    const t = Math.max(0, 1 - dist / RADIUS_PX)

                    const px = ((clientX - rect.left) / rect.width) * 100
                    const py = ((clientY - rect.top) / rect.height) * 100

                    el.style.setProperty("--glowOpacity", (t * 0.95).toString())
                    el.style.setProperty("--glowX", `${px}%`)
                    el.style.setProperty("--glowY", `${py}%`)
                })
            })
        }

        const handleLeave = () => {
            targets.forEach((el) => {
                el.style.setProperty("--glowOpacity", "0")
            })
        }

        root.addEventListener("mousemove", handleMove)
        root.addEventListener("mouseleave", handleLeave)

        return () => {
            root.removeEventListener("mousemove", handleMove)
            root.removeEventListener("mouseleave", handleLeave)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-background pt-[100px]">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
                <div className="relative h-full w-full">
                    <Image src="/bg.png" alt="" fill priority sizes="100vw" className="select-none object-cover object-center" />
                </div>
            </div>

            <div aria-hidden="true" className="absolute inset-0 z-0">
                <div className="pointer-events-none absolute -top-24 -left-24 h-[60vh] w-[60vh] rounded-full bg-[#3A86FF]/28 blur-3xl" />
                <div className="pointer-events-none absolute top-1/3 right-[15%] h-[40vh] w-[40vh] rounded-full bg-[#A7F3D0]/30 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-[70vh] w-[70vh] rounded-full bg-[#8B5CF6]/24 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-[92%] max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-16 md:px-12 md:py-24">
                    <div className="flex flex-col justify-center gap-6 text-center lg:text-left">
                        <h1 className="text-pretty font-[family-name:var(--font-poppins)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
                            <i>
                                Keuangan Bareng, Jadi{" "}
                                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3A86FF] to-[#10B981] bg-clip-text text-transparent">
                                    #GampangAntiRibet!{" "}
                                </span>
                                Bye Ribet!
                            </i>
                        </h1>

                        <p className="mx-auto lg:mx-0 max-w-xl text-base md:text-lg leading-relaxed text-foreground/85">
                            "CredBar adalah cara baru yang transparan untuk mengelola iuran, patungan, dan hutang di kelompokmu.
                            Lupakan drama menagih manual, semua tercatat dan diingatkan otomatis."
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <div
                                className="proximity-glow"
                                style={{
                                    // enforce violet glow for proximity effect on this button
                                    // @ts-ignore - CSS custom props
                                    "--glow-rgb": "139 92 246",
                                    // optional: keep mix also violet to make the glow cleaner
                                    // @ts-ignore
                                    "--glow-mix-rgb": "139 92 246",
                                }}
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="
                    rounded-full px-9 py-5 text-base md:text-lg font-bold tracking-wide
                    bg-[rgb(var(--color-success))] 
                    text-[rgb(var(--color-success-foreground))]
                    border border-[rgb(var(--color-success))]
                    shadow-[0_10px_28px_rgba(139,92,246,0.45),0_6px_16px_rgba(139,92,246,0.25)]
                    hover:translate-y-[-2px]
                    hover:bg-[rgb(var(--color-card))]
                    hover:text-[rgb(var(--color-success))]
                    hover:border-[rgb(var(--color-success))]
                    hover:shadow-[0_16px_36px_rgba(139,92,246,0.55),0_8px_22px_rgba(139,92,246,0.35)]
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-[rgb(var(--color-success))]
                    active:scale-95 transition
                  "
                                >
                                    <Link href="/login" aria-label="Mulai Sekarang">
                                        Buat Grup Pertamamu !
                                    </Link>
                                </Button>
                            </div>

                            <div
                                className="proximity-glow"
                                style={{
                                    // enforce violet glow for proximity effect on this button
                                    // @ts-ignore
                                    "--glow-rgb": "139 92 246",
                                    // optional: keep mix also violet to make the glow cleaner
                                    // @ts-ignore
                                    "--glow-mix-rgb": "139 92 246",
                                }}
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="
                    rounded-full px-9 py-5 text-base md:text-lg font-bold tracking-wide
                    bg-[rgb(var(--color-primary))] 
                    text-[rgb(var(--color-primary-foreground))]
                    border border-[rgb(var(--color-primary))]
                    shadow-[0_10px_28px_rgba(139,92,246,0.35),0_6px_16px_rgba(139,92,246,0.20)]
                    hover:translate-y-[-2px]
                    hover:bg-[rgb(var(--color-card))]
                    hover:text-[rgb(var(--color-primary))]
                    hover:border-[rgb(var(--color-primary))]
                    hover:shadow-[0_16px_36px_rgba(139,92,246,0.50),0_8px_22px_rgba(139,92,246,0.30)]
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-[rgb(var(--color-primary))]
                    active:scale-95 transition
                  "
                                >
                                    <Link href="/tutor" aria-label="Lihat Detail">
                                        Detail
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div aria-hidden className="hidden lg:block" />
                </div>
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-20 translate-x-6 sm:translate-x-1 translate-y-8 sm:translate-y-12"
            >
                <Image
                    src="/ee.png"
                    alt="Tampilan aplikasi CredBar pada ponsel"
                    width={450}
                    height={450}
                    priority
                    className="select-none object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.35)]"
                />
            </div>
        </section>
    )
}
