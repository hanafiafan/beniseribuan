import { db } from "@/lib/db"
import { flashSales, flashSaleProducts, products, productImages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { id } = await params
    const saleId = Number(id)

    // 1. Fetch Flash Sale
    const [sale] = await db.select().from(flashSales).where(eq(flashSales.id, saleId))

    if (!sale) {
      return NextResponse.json({ error: "Flash sale not found" }, { status: 404 })
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
        price: products.price,
        stock: products.stock
      }
    })
    .from(flashSaleProducts)
    .where(eq(flashSaleProducts.flashSaleId, saleId))
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
      ...sale,
      products: productsWithImages
    })
  } catch (error: any) {
    console.error("❌ API ERROR (Flash Sale GET ID):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const { id } = await params
    const saleId = Number(id)
    const body = await req.json()
    const { name, startDate, endDate, description, products: saleProducts } = body

    // 1. Update Flash Sale
    await db.update(flashSales)
      .set({
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .where(eq(flashSales.id, saleId))

    // 2. Delete existing products and re-insert (easiest for sync)
    await db.delete(flashSaleProducts).where(eq(flashSaleProducts.flashSaleId, saleId))

    // 3. Insert Flash Sale Products
    if (saleProducts && saleProducts.length > 0) {
      const productValues = saleProducts.map((p: any) => ({
        flashSaleId: saleId,
        productId: Number(p.productId),
        flashPrice: p.flashPrice.toString(),
        stock: Number(p.stock),
        soldCount: p.soldCount || 0
      }))
      await db.insert(flashSaleProducts).values(productValues)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ API ERROR (Flash Sale PATCH):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const { id } = await params
    const saleId = Number(id)

    // Delete products first (FK constraint)
    await db.delete(flashSaleProducts).where(eq(flashSaleProducts.flashSaleId, saleId))
    // Delete the sale
    await db.delete(flashSales).where(eq(flashSales.id, saleId))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ API ERROR (Flash Sale DELETE):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
