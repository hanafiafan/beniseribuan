import { db } from "@/lib/db"
import { flashSales, flashSaleProducts, products, productImages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 1. Fetch Flash Sales first
    const sales = await db.select()
      .from(flashSales)
      .orderBy(desc(flashSales.startDate))

    // 2. For each sale, fetch its products manually to avoid MariaDB SQL errors
    const fullSales = await Promise.all(sales.map(async (sale) => {
      const saleProducts = await db.select({
        id: flashSaleProducts.id,
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
      .where(eq(flashSaleProducts.flashSaleId, sale.id))
      .innerJoin(products, eq(flashSaleProducts.productId, products.id))

      // Get images for each product in the sale
      const productsWithImages = await Promise.all(saleProducts.map(async (sp) => {
        const images = await db.select().from(productImages).where(eq(productImages.productId, sp.product.id))
        return {
          ...sp,
          product: {
            ...sp.product,
            images
          }
        }
      }))

      return {
        ...sale,
        products: productsWithImages
      }
    }))

    return NextResponse.json(fullSales)
  } catch (error: any) {
    console.error("❌ API ERROR (Flash Sales GET):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, startDate, endDate, description, products: saleProducts } = body

    // 1. Insert Flash Sale
    const [result] = await db.insert(flashSales).values({
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
    })

    const flashSaleId = result.insertId

    // 2. Insert Flash Sale Products
    if (saleProducts && saleProducts.length > 0) {
      const productValues = saleProducts.map((p: any) => ({
        flashSaleId: Number(flashSaleId),
        productId: Number(p.productId),
        flashPrice: p.flashPrice.toString(),
        stock: Number(p.stock),
        soldCount: 0
      }))
      await db.insert(flashSaleProducts).values(productValues)
    }

    return NextResponse.json({ success: true, id: flashSaleId })
  } catch (error: any) {
    console.error("❌ API ERROR (Flash Sales POST):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
