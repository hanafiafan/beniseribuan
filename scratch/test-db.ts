import { db, pool } from './src/lib/db/index'
import { products } from './src/lib/db/schema'

async function testConnection() {
  console.log("--- DATABASE CONNECTION TEST ---")
  console.log("Config:", {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER
  })

  try {
    const result = await db.select().from(products).limit(1)
    console.log("SUCCESS: Connection established and query successful.")
    console.log("Sample product:", result[0]?.name || "No products found in table.")
  } catch (error: any) {
    console.error("FAILED: Database connection or query error.")
    console.error("Error Code:", error.code)
    console.error("Error Message:", error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log("HINT: MySQL server is not running or port is incorrect.")
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("HINT: Incorrect username or password.")
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log("HINT: Database name does not exist.")
    }
  } finally {
    await pool.end()
    process.exit()
  }
}

testConnection()
