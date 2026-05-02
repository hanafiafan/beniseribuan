import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const xenditToken = req.headers.get('x-callback-token')

    // Verifikasi Webhook Token (Ambil dari .env)
    if (xenditToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, external_id, amount } = body

    if (status === 'PAID' || status === 'SETTLED') {
      // Cari pesanan berdasarkan orderNumber (external_id)
      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, external_id)
      })

      if (existingOrder) {
        await db.update(orders)
          .set({ 
            status: 'paid',
            paidAt: new Date()
          })
          .where(eq(orders.orderNumber, external_id))
        
        console.log(`✅ Order #${external_id} marked as PAID via Xendit Webhook`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Xendit Webhook Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
