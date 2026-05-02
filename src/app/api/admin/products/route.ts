import { db } from "@/lib/db"
import { products, productImages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const list = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      price: products.price,
      salePrice: products.salePrice,
      stock: products.stock,
      isActive: products.isActive,
      createdAt: products.createdAt,
    })
    .from(products)
    .orderBy(desc(products.createdAt))

    return NextResponse.json(list)
  } catch (error: any) {
    console.error("❌ API ERROR (Products GET):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, slug, description, shortDescription, price, salePrice, stock, weight, categoryId, images, brand, isFeatured, isDigital } = body

    const result = await db.insert(products).values({
      name,
      slug,
      description,
      shortDescription,
      price: price.toString(),
      salePrice: salePrice?.toString() || null,
      stock: Number(stock),
      weight: weight?.toString() || "0",
      categoryId: categoryId ? Number(categoryId) : null,
      brand: brand || 'Benih Seribuan',
      isFeatured: !!isFeatured,
      isDigital: !!isDigital,
      specs: specs ? JSON.stringify(specs) : null,
      isActive: true,
    })

    const productId = result[0].insertId

    // Insert images if any
    if (images && images.length > 0) {
      const imageValues = images.map((url: string, index: number) => ({
        productId: Number(productId),
        url,
        sortOrder: index
      }))
      await db.insert(productImages).values(imageValues)
    }

    return NextResponse.json({ success: true, id: productId })
  } catch (error: any) {
    console.error("❌ API ERROR (Products POST):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, name, slug, description, shortDescription, price, salePrice, stock, weight, categoryId, brand, isFeatured, isDigital, specs } = body

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 })

    await db.update(products)
      .set({
        name,
        slug,
        description,
        shortDescription,
        price: price.toString(),
        salePrice: salePrice?.toString() || null,
        stock: Number(stock),
        weight: weight?.toString() || "0",
        categoryId: categoryId ? Number(categoryId) : null,
        brand: brand || 'Benih Seribuan',
        isFeatured: !!isFeatured,
        isDigital: !!isDigital,
        specs: specs ? JSON.stringify(specs) : null,
      })
      .where(eq(products.id, Number(id)))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ API ERROR (Products PATCH):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
