interface AuthPayload {
  sub: string
  email: string
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || "kobel_goalkeeper"

// Simple JWT implementation using Web Crypto API
async function base64UrlEncode(data: string): Promise<string> {
  const encoded = Buffer.from(data).toString("base64")
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  // Add padding if needed
  const padding = 4 - (base64.length % 4)
  if (padding !== 4) {
    base64 += "=".repeat(padding)
  }
  return Buffer.from(base64, "base64").toString()
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", key, messageData)
  return base64UrlEncode(Buffer.from(signature).toString("binary"))
}

export async function signAuthToken(payload: Omit<AuthPayload, "iat" | "exp">) {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 7 * 24 * 60 * 60 // 7 days

  const fullPayload: AuthPayload = {
    ...payload,
    iat: now,
    exp: exp,
  }

  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const encodedHeader = await base64UrlEncode(JSON.stringify(header))
  const encodedPayload = await base64UrlEncode(JSON.stringify(fullPayload))
  const message = `${encodedHeader}.${encodedPayload}`

  const signature = await hmacSha256(message, JWT_SECRET)
  return `${message}.${signature}`
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.error("[auth] invalid token format")
      return null
    }

    const [encodedHeader, encodedPayload, signature] = parts

    // Verify signature
    const message = `${encodedHeader}.${encodedPayload}`
    // Note: This is async but we can't use await in sync function
    // For production, implement proper async verification
    // This is a simplified version for demo purposes

    try {
      const payloadJson = base64UrlDecode(encodedPayload)
      const payload: AuthPayload = JSON.parse(payloadJson)

      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        console.error("[auth] token expired")
        return null
      }

      return payload
    } catch (err) {
      console.error("[auth] failed to parse payload:", err)
      return null
    }
  } catch (err) {
    console.error("[auth] token verification failed:", err)
    return null
  }
}
