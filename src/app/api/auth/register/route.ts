import { db } from "@/lib/db"
import { users, addresses } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      firstName, lastName, email, phone, password,
      province, provinceId, city, cityId, district, postalCode, address
    } = body

    // 1. Validasi Input Dasar
    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "Data akun tidak lengkap" }, { status: 400 })
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Jalankan Transaksi (Simpan User & Alamat)
    const [userResult] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      displayName: `${firstName} ${lastName || ''}`.trim(),
      role: 'customer',
      provider: 'credentials',
      isActive: true,
      createdAt: new Date(),
    })

    const newUserId = userResult.insertId

    // 5. Simpan Alamat jika ada
    if (provinceId && cityId && address) {
      await db.insert(addresses).values({
        userId: newUserId,
        label: 'Alamat Utama',
        recipientName: `${firstName} ${lastName || ''}`.trim(),
        phone: phone,
        province,
        provinceId: Number(provinceId),
        city,
        cityId: Number(cityId),
        district,
        postalCode,
        address,
        isDefault: true,
        type: 'shipping'
      })
    }

    return NextResponse.json({ success: true, message: "Pendaftaran berhasil" })
  } catch (error: any) {
    console.error("Registration Error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server: " + error.message }, { status: 500 })
  }
}
