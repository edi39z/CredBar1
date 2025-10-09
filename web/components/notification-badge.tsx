"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface NotificationBadgeProps {
  className?: string
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(3) // Mock unread count

  // In a real app, this would fetch from an API or context
  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Random chance to update notification count
      if (Math.random() > 0.8) {
        setUnreadCount((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <Bell className="h-5 w-5 text-[rgb(55,65,81)]" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-[rgb(239,68,68)] hover:bg-[rgb(239,68,68)]">
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
