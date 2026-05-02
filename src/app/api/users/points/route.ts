import { auth } from "@/auth"
import { db } from "@/lib/db"
import { loyaltyPoints, pointTransactions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = Number(session.user.id)

  try {
    const points = await db.query.loyaltyPoints.findFirst({
      where: eq(loyaltyPoints.userId, userId)
    })

    const history = await db.query.pointTransactions.findMany({
      where: eq(pointTransactions.userId, userId),
      orderBy: [desc(pointTransactions.createdAt)],
      limit: 10
    })

    return NextResponse.json({
      points: points?.points || 0,
      totalEarned: points?.totalEarned || 0,
      history
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
