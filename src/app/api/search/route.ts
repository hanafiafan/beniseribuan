import { db } from "@/lib/db"
import { products, productImages, categories } from "@/lib/db/schema"
import { like, or, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  try {
    // 1. Search products
    const results = await db.select()
      .from(products)
      .where(or(
        like(products.name, `%${q}%`),
        like(products.sku, `%${q}%`),
        like(products.description, `%${q}%`)
      ))
      .limit(8)

    // 2. Fetch images and categories manually
    const fullResults = await Promise.all(results.map(async (product) => {
      const images = await db.select().from(productImages).where(eq(productImages.productId, product.id))
      const category = product.categoryId 
        ? (await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1))[0]
        : null
      
      return {
        ...product,
        images,
        category
      }
    }))

    return NextResponse.json(fullResults)
  } catch (error: any) {
    console.error("❌ API ERROR (Search GET):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
