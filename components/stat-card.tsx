import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    bgColor: string
    textColor: string
    iconBgColor: string
}

export function StatCard({ title, value, icon, trend, bgColor, textColor, iconBgColor }: StatCardProps) {
    return (
        <Card className={`${bgColor} ${textColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
                    <div className={`${iconBgColor} p-2 rounded-lg`}>{icon}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">{value}</div>
                    {trend && (
                        <div className="flex items-center gap-1 text-xs font-semibold opacity-80">
                            <ArrowUpRight className="h-3 w-3" />
                            {trend}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
