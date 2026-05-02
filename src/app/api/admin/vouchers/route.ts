import { db } from "@/lib/db"
import { vouchers } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const list = await db.query.vouchers.findMany({
      orderBy: [desc(vouchers.createdAt)]
    })

    return NextResponse.json(list)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
