import { db } from "@/lib/db"
import { auditLog, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logs = await db.select({
      id: auditLog.id,
      action: auditLog.action,
      entity: auditLog.entity,
      createdAt: auditLog.createdAt,
      ipAddress: auditLog.ipAddress,
      user: {
        displayName: users.displayName,
        email: users.email
      }
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.userId, users.id))
    .orderBy(desc(auditLog.createdAt))
    .limit(50)

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Failed to fetch audit logs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
