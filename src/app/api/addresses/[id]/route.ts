import { auth } from "@/auth"
import { db } from "@/lib/db"
import { addresses } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const addressId = Number(params.id)

    const { 
      label, recipientName, phone, province, provinceId, 
      city, cityId, district, village, postalCode, address, isDefault,
      latitude, longitude
    } = body

    await db.update(addresses)
      .set({
        label,
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
        updatedAt: new Date()
      })

      .where(and(
        eq(addresses.id, addressId),
        eq(addresses.userId, Number(session.user.id))
      ))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const addressId = Number(params.id)

    // Ensure we don't delete the default address if others exist, 
    // or handle it by making another one default (complex logic, keeping it simple for now)
    
    await db.delete(addresses)
      .where(and(
        eq(addresses.id, addressId),
        eq(addresses.userId, Number(session.user.id))
      ))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
