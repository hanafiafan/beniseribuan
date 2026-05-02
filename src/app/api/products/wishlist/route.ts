import { db } from "@/lib/db"
import { products, productImages, categories } from "@/lib/db/schema"
import { inArray, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { ids } = await req.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([])
    }

    // Standard Join for better compatibility with older MariaDB/MySQL
    const wishlistProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        weight: products.weight,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(inArray(products.id, ids.map(id => Number(id))))

    // Fetch images separately to avoid complex joins and duplicate rows
    const formatted = await Promise.all(wishlistProducts.map(async (p) => {
      const [img] = await db
        .select({ url: productImages.url })
        .from(productImages)
        .where(eq(productImages.productId, p.id))
        .orderBy(productImages.sortOrder)
        .limit(1)

      return {
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        image: img?.url || '/images/placeholder.png',
        category: p.categoryName,
        stock: p.stock,
        weight: Number(p.weight),
        rating: 5.0,
        soldCount: 0,
      }
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    console.error("❌ WISHLIST API ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

