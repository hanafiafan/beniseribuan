import { auth } from "@/auth"
import { db } from "@/lib/db"
import { recentlyViewed, products, productImages } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null
  
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('view_session_id')?.value

  if (!userId && !sessionId) {
    return NextResponse.json([])
  }

  try {
    // 1. Fetch recently viewed items
    const history = await db.select()
      .from(recentlyViewed)
      .where(userId 
        ? eq(recentlyViewed.userId, userId)
        : eq(recentlyViewed.sessionId, sessionId!)
      )
      .orderBy(desc(recentlyViewed.viewedAt))
      .limit(10)

    // 2. Fetch product details for each item manually
    const fullHistory = await Promise.all(history.map(async (item) => {
      const productResults = await db.select().from(products).where(eq(products.id, item.productId)).limit(1)
      const product = productResults[0]
      
      if (!product) return null

      const images = await db.select().from(productImages).where(eq(productImages.productId, product.id))
      
      return {
        ...item,
        product: {
          ...product,
          images
        }
      }
    }))

    return NextResponse.json(fullHistory.filter(Boolean))
  } catch (error: any) {
    console.error("❌ API ERROR (Recently Viewed GET):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
