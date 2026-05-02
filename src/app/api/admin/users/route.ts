import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))
    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("Failed to fetch admin users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await db.delete(users).where(eq(users.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, role } = await req.json()
    await db.update(users).set({ role }).where(eq(users.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
