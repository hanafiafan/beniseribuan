import { db } from "../src/lib/db"
import { products, productImages } from "../src/lib/db/schema"
import { eq } from "drizzle-orm"

async function test() {
  try {
    console.log("Fetching products...")
    const allProducts = await db.select().from(products)
    
    console.log("Products count:", allProducts.length)
    for (const p of allProducts) {
      console.log(`- ID: ${p.id}, Name: ${p.name}, Slug: ${p.slug}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

test()
