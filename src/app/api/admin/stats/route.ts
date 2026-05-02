import { db } from "@/lib/db"
import { orders, users, products, orderItems } from "@/lib/db/schema"
import { eq, sql, desc, and, not } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  // Basic security: Check if user is admin (you should add isAdmin field to users table)
  // For now, let's allow it but you should lock this down
  
  try {
    // 1. Total Revenue (Paid orders)
    const revenueResult = await db.select({ 
      total: sql<string>`sum(total)` 
    })
    .from(orders)
    .where(and(
      not(eq(orders.status, 'PENDING')),
      not(eq(orders.status, 'CANCELLED'))
    ))
    
    const totalRevenue = Number(revenueResult[0]?.total || 0)

    // 2. Total Orders
    const ordersCount = await db.select({ count: sql<number>`count(*)` }).from(orders)

    // 3. Total Customers
    const customersCount = await db.select({ count: sql<number>`count(*)` }).from(users)

    // 4. Total Products
    const productsCount = await db.select({ count: sql<number>`count(*)` }).from(products)

    // 5. Recent Orders (Using join for MariaDB compatibility)
    const recentOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      user: {
        displayName: users.displayName,
        email: users.email
      }
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5)

    return NextResponse.json({
      revenue: totalRevenue,
      orders: ordersCount[0].count,
      customers: customersCount[0].count,
      products: productsCount[0].count,
      recentOrders: recentOrders
    })

  } catch (error: any) {
    console.error("❌ API ERROR (Stats):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
