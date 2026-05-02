import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, orderItems, products } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { createXenditInvoice } from "@/lib/xendit"
import { eq, sql } from "drizzle-orm"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { 
      items, subtotal, shippingCost, total, 
      shippingAddress, paymentMethod 
    } = body

    // 1. Basic Stock Check (Optional but recommended)
    // You can iterate items and check against 'products' table

    const orderNumber = `BSB-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    let paymentUrl = null
    let paymentId = null

    // 2. Create Xendit Invoice if selected
    if (paymentMethod === 'xendit') {
      const invoice = await createXenditInvoice({
        externalId: orderNumber,
        amount: Number(total),
        payerEmail: session.user.email || 'customer@benihseribuan.co.id',
        description: `Pembayaran Pesanan Benih Seribuan #${orderNumber}`,
        customerName: session.user.name || 'Pelanggan Setia'
      })
      paymentUrl = invoice.invoiceUrl
      paymentId = invoice.id
    }

    // 3. Insert the order
    const [result] = await db.insert(orders).values({
      orderNumber,
      userId: Number(session.user.id),
      status: paymentMethod === 'xendit' ? 'awaiting_payment' : 'pending',
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      total: total.toString(),
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod,
      paymentId,
      paymentUrl,
      createdAt: new Date(),
    })

    const orderId = result.insertId

    // 4. Insert order items
    const itemsToInsert = items.map((item: any) => ({
      orderId: Number(orderId),
      productId: item.productId,
      variantId: item.variantId || null,
      name: item.name,
      variantName: item.variantName || null,
      price: item.price.toString(),
      quantity: item.quantity,
      image: item.image,
    }))

    await db.insert(orderItems).values(itemsToInsert)

    // 5. Update Product Stock (Atomic decrement)
    for (const item of items) {
      await db.update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId))
    }

    return NextResponse.json({ 
      success: true, 
      orderId: Number(orderId), 
      orderNumber,
      paymentUrl 
    })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
