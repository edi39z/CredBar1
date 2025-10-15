import { neon } from "@neondatabase/serverless"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

async function main() {
    const url = process.env.DATABASE_URL
    if (!url) {
        console.log("[v0] DATABASE_URL is missing in Vars. Please add your Neon connection string.")
        process.exit(1)
    }
    const sql = neon(url)

    const dir = join(process.cwd(), "scripts", "sql")
    const files = readdirSync(dir)
        .filter((f) => f.endsWith(".sql"))
        .sort()

    console.log("[v0] Running SQL migrations:", files)
    for (const file of files) {
        const content = readFileSync(join(dir, file), "utf8")
        console.log(`[v0] Executing ${file}...`)
        await sql(content)
        console.log(`[v0] Done ${file}`)
    }

    console.log("[v0] All migrations executed successfully.")
}

main().catch((err) => {
    console.error("[v0] Migration failed:", err)
    process.exit(1)
})
