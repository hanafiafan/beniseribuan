import { auth } from "@/auth"
import { db } from "@/lib/db"
import { addresses } from "@/lib/db/schema"
import { eq, and, not } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const addressId = Number(params.id)
    const userId = Number(session.user.id)

    // 1. Set all user addresses to NOT default
    await db.update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId))

    // 2. Set the target address to default
    await db.update(addresses)
      .set({ isDefault: true })
      .where(and(
        eq(addresses.id, addressId),
        eq(addresses.userId, userId)
      ))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
