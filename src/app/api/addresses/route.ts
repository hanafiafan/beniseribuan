import { auth } from "@/auth"
import { db } from "@/lib/db"
import { addresses } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const userAddresses = await db.select()
      .from(addresses)
      .where(eq(addresses.userId, Number(session.user.id)))
    
    return NextResponse.json(userAddresses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { 
      label, recipientName, phone, province, provinceId, 
      city, cityId, district, village, postalCode, address, isDefault,
      latitude, longitude
    } = body

    // If isDefault is true, unset other defaults
    if (isDefault) {
      await db.update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, Number(session.user.id)))
    }

    const [result] = await db.insert(addresses).values({
      userId: Number(session.user.id),
      label: label || "Rumah",
      recipientName,
      phone,
      province,
      provinceId: Number(provinceId),
      city,
      cityId: Number(cityId),
      district,
      village,
      postalCode,
      address,
      latitude: latitude ? latitude.toString() : null,
      longitude: longitude ? longitude.toString() : null,
      isDefault: isDefault || false,
      type: 'shipping'
    })


    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error: any) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
