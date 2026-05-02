import { db } from "@/lib/db"
import { products, productImages, productVariants, categories } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params // Next.js 15+ requires awaiting params
    
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    const product = result[0]

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Fetch related data
    const images = await db.select().from(productImages).where(eq(productImages.productId, product.id))
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id))
    const category = product.categoryId ? 
      await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1) : []

    return NextResponse.json({
      ...product,
      images,
      variants,
      category: category[0] || null
    })
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
