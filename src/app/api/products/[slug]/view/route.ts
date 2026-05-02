import { auth } from "@/auth"
import { db } from "@/lib/db"
import { recentlyViewed, products } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null
  
  // Get or create sessionId for anonymous users
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('view_session_id')?.value
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15)
    cookieStore.set('view_session_id', sessionId, { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/' 
    })
  }

  try {
    const slug = params.slug
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug)
    })

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    // Check if already viewed recently to avoid spam/duplicates
    const existing = await db.query.recentlyViewed.findFirst({
      where: userId 
        ? and(eq(recentlyViewed.userId, userId), eq(recentlyViewed.productId, product.id))
        : and(eq(recentlyViewed.sessionId, sessionId), eq(recentlyViewed.productId, product.id))
    })

    if (existing) {
      // Update timestamp
      await db.update(recentlyViewed)
        .set({ viewedAt: new Date() })
        .where(eq(recentlyViewed.id, existing.id))
    } else {
      // Insert new view
      await db.insert(recentlyViewed).values({
        userId,
        sessionId,
        productId: product.id,
        viewedAt: new Date()
      })
      
      // Optional: Keep only last 10-20 views per user/session to save space
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
