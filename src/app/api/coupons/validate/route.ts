import { db } from "@/lib/db"
import { vouchers } from "@/lib/db/schema"
import { eq, and, gt, gte, lt } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()

    if (!code) return NextResponse.json({ error: "Kode voucher diperlukan" }, { status: 400 })

    const now = new Date()
    const voucher = await db.query.vouchers.findFirst({
      where: and(
        eq(vouchers.code, code.toUpperCase()),
        eq(vouchers.isActive, true)
      )
    })

    if (!voucher) {
      return NextResponse.json({ error: "Voucher tidak ditemukan atau tidak aktif" }, { status: 404 })
    }

    // Check dates
    if (voucher.startDate && now < voucher.startDate) {
      return NextResponse.json({ error: "Voucher belum bisa digunakan" }, { status: 400 })
    }
    if (voucher.endDate && now > voucher.endDate) {
      return NextResponse.json({ error: "Voucher sudah kedaluwarsa" }, { status: 400 })
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usedCount! >= voucher.usageLimit) {
      return NextResponse.json({ error: "Kupon sudah habis digunakan" }, { status: 400 })
    }

    // Check min purchase
    if (voucher.minPurchase && Number(subtotal) < Number(voucher.minPurchase)) {
      return NextResponse.json({ 
        error: `Minimal pembelian untuk voucher ini adalah Rp ${Number(voucher.minPurchase).toLocaleString('id-ID')}` 
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (voucher.type === 'percentage') {
      discount = (Number(subtotal) * Number(voucher.value)) / 100
      if (voucher.maxDiscount && discount > Number(voucher.maxDiscount)) {
        discount = Number(voucher.maxDiscount)
      }
    } else if (voucher.type === 'fixed') {
      discount = Number(voucher.value)
    } else if (voucher.type === 'free_shipping') {
      // Logic for free shipping will be handled on checkout
      discount = 0 
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        discount: discount
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
