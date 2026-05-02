import { db } from "@/lib/db"
import { flashSales, flashSaleProducts, products, productImages } from "@/lib/db/schema"
import { eq, and, lte, gte } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const now = new Date()
    
    // 1. Find the currently active flash sale manually
    const [activeSale] = await db.select()
      .from(flashSales)
      .where(and(
        eq(flashSales.isActive, true),
        lte(flashSales.startDate, now),
        gte(flashSales.endDate, now)
      ))
      .limit(1)

    if (!activeSale) {
      return NextResponse.json({ error: "No active flash sale" }, { status: 404 })
    }

    // 2. Fetch associated products
    const saleProducts = await db.select({
      id: flashSaleProducts.id,
      productId: flashSaleProducts.productId,
      flashPrice: flashSaleProducts.flashPrice,
      stock: flashSaleProducts.stock,
      soldCount: flashSaleProducts.soldCount,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price
      }
    })
    .from(flashSaleProducts)
    .where(eq(flashSaleProducts.flashSaleId, activeSale.id))
    .innerJoin(products, eq(flashSaleProducts.productId, products.id))

    // 3. Fetch images for each product
    const productsWithImages = await Promise.all(saleProducts.map(async (sp) => {
      const images = await db.select().from(productImages).where(eq(productImages.productId, sp.productId))
      return {
        ...sp,
        product: {
          ...sp.product,
          images
        }
      }
    }))

    return NextResponse.json({
      ...activeSale,
      products: productsWithImages
    })
  } catch (error: any) {
    console.error("❌ API ERROR (Marketing Flash Sale):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
