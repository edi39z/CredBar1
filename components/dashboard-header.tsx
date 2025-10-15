"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, ArrowLeft, Settings } from "lucide-react"
import { NotificationBadge } from "@/components/notification-badge"

type Props = {
    title: string
    subtitle?: string
    backHref?: string
    rightActions?: ReactNode
    showSearch?: boolean
}

export function DashboardHeader({ title, subtitle, backHref, rightActions, showSearch = true }: Props) {
    const router = useRouter()

    return (
        <header className="border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {backHref ? (
                            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.push(backHref)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        ) : (
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 grid place-items-center">
                                <Image src="/logo.png" alt="CredBar" width={24} height={24} className="object-contain" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground text-pretty">{title}</h1>
                            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
                        </div>
                    </div>

                    {showSearch && (
                        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
                            <Input placeholder="Cari data, room, atau anggota..." className="w-full" />
                            <Badge variant="secondary" className="hidden lg:inline-flex">
                                Search
                            </Badge>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => (window.location.href = "/notifications")}
                            className="relative"
                        >
                            <NotificationBadge />
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Avatar
                            className="h-8 w-8 border border-border/50 cursor-pointer"
                            onClick={() => (window.location.href = "/profile")}
                        >
                            <AvatarImage src="/diverse-avatars.png" />
                            <AvatarFallback className="bg-primary/10 text-primary">CB</AvatarFallback>
                        </Avatar>
                        {rightActions}
                    </div>
                </div>
            </div>
        </header>
    )
}
