import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const allSettings = await db.select().from(settings)
    // Convert to key-value pair
    const settingsObj = allSettings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    
    return NextResponse.json(settingsObj)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, value } = body
    
    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 })
    
    // Check if exists
    const [existing] = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
    
    if (existing) {
      await db.update(settings).set({ value: String(value) }).where(eq(settings.key, key))
    } else {
      await db.insert(settings).values({ key, value: String(value) })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
