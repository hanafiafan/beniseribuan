import { db } from "@/lib/db"
import { products, categories, productImages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Unwrap params for Next.js 15+ compatibility
    const { id: idParam } = await params
    const id = Number(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // 2. Fetch product using flat query for MariaDB compatibility
    const productResults = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (productResults.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = productResults[0]

    // 3. Fetch related data separately to avoid LATERAL JOIN / JSON_ARRAYAGG
    const images = await db.select().from(productImages).where(eq(productImages.productId, id))
    const category = product.categoryId 
      ? (await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1))[0] 
      : null

    return NextResponse.json({
      ...product,
      images,
      category
    })
  } catch (error: any) {
    console.error("❌ API ERROR (Single Product GET):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    await db.delete(products).where(eq(products.id, id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ API ERROR (Product DELETE):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
