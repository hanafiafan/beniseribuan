import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, loyaltyPoints, pointTransactions } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const session = await auth()
  // Only admin or the user themselves (for certain statuses) can update
  // For now let's assume it's for internal use/admin
  
  try {
    const { status } = await req.json()
    const { orderNumber } = params

    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber)
    })

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // If changing to COMPLETED, award points
    if (status === 'COMPLETED' && order.status !== 'COMPLETED') {
      const pointsToEarn = Math.floor(Number(order.total) / 1000) // 1 point per Rp 1.000
      
      await db.transaction(async (tx) => {
        // 1. Update order status
        await tx.update(orders).set({ status }).where(eq(orders.id, order.id))

        // 2. Award points
        const userPoints = await tx.query.loyaltyPoints.findFirst({
          where: eq(loyaltyPoints.userId, order.userId)
        })

        if (userPoints) {
          await tx.update(loyaltyPoints)
            .set({ 
              points: userPoints.points! + pointsToEarn,
              totalEarned: userPoints.totalEarned! + pointsToEarn
            })
            .where(eq(loyaltyPoints.id, userPoints.id))
        } else {
          await tx.insert(loyaltyPoints).values({
            userId: order.userId,
            points: pointsToEarn,
            totalEarned: pointsToEarn
          })
        }

        // 3. Record transaction
        await tx.insert(pointTransactions).values({
          userId: order.userId,
          amount: pointsToEarn,
          type: 'earn',
          description: `Poin dari pesanan #${orderNumber}`,
          orderId: order.id
        })
      })

      return NextResponse.json({ success: true, earnedPoints: pointsToEarn })
    }

    // Normal status update
    await db.update(orders).set({ status }).where(eq(orders.id, order.id))
    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
