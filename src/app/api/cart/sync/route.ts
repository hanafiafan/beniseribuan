import { auth } from "@/auth"
import { db } from "@/lib/db"
import { carts, cartItems } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = Number(session.user.id)
  const { items } = await req.json()

  try {
    // 1. Find or create the user's cart
    let userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId)
    })

    if (!userCart) {
      const result = await db.insert(carts).values({ userId }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } })
      userCart = await db.query.carts.findFirst({
        where: eq(carts.userId, userId)
      })
    }

    if (!userCart) throw new Error("Failed to create/find cart")

    // 2. Clear existing items and re-insert (Atomic sync)
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id))

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        cartId: userCart!.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity
      }))
      await db.insert(cartItems).values(itemsToInsert)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ API ERROR (Cart Sync):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
