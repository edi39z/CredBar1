"use client"

import { useEffect, useState } from "react"

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    let active = true

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          signal,
        })

        if (!active) return

        if (!res.ok) {
          console.warn("[v0] User fetch failed:", res.status)
          setUser(null)
        } else {
          const data = await res.json()
          console.log("[v0] User fetched:", data)

          setUser({
            id: data.userId,   // 🟢 penting!
            email: data.email, // 🟢
          })
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("[v0] Error fetching user:", err)
          if (active) setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchUser()
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return { user, loading }
}

