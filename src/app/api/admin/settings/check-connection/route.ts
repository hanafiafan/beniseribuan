import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { provider, keys } = await req.json()

    // 1. XENDIT
    if (provider === 'xendit') {
      const auth = Buffer.from(`${keys.XENDIT_SECRET_KEY}:`).toString('base64')
      const res = await fetch('https://api.xendit.co/balance', {
        headers: { 'Authorization': `Basic ${auth}` }
      })
      if (res.ok) return NextResponse.json({ success: true, message: "Koneksi Berhasil! Saldo terdeteksi." })
      return NextResponse.json({ success: false, message: "Secret Key tidak valid." })
    }

    // 2. RAJAONGKIR
    if (provider === 'rajaongkir') {
      const res = await fetch(`https://api.rajaongkir.com/${keys.RAJAONGKIR_TYPE || 'pro'}/province`, {
        headers: { 'key': keys.RAJAONGKIR_API_KEY }
      })
      const data = await res.json()
      if (data?.rajaongkir?.status?.code === 200) return NextResponse.json({ success: true, message: "Koneksi Berhasil! Data provinsi didapat." })
      return NextResponse.json({ success: false, message: data?.rajaongkir?.status?.description || "Gagal menghubungkan." })
    }

    // 3. FONNTE
    if (provider === 'fonnte') {
      const res = await fetch('https://api.fonnte.com/get-devices', {
        method: 'POST',
        headers: { 'Authorization': keys.FONNTE_API_KEY }
      })
      const data = await res.json()
      if (data.status) return NextResponse.json({ success: true, message: "WhatsApp Terhubung!" })
      return NextResponse.json({ success: false, message: data.reason || "Token tidak valid." })
    }

    // 4. RESEND (Email)
    if (provider === 'resend') {
      const res = await fetch('https://api.resend.com/emails', {
        headers: { 'Authorization': `Bearer ${keys.RESEND_API_KEY}` }
      })
      if (res.status === 401) return NextResponse.json({ success: false, message: "API Key salah." })
      return NextResponse.json({ success: true, message: "Koneksi Email Aktif." })
    }

    // 5. OPENAI
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${keys.OPENAI_API_KEY}` }
      })
      if (res.ok) return NextResponse.json({ success: true, message: "OpenAI Aktif!" })
      return NextResponse.json({ success: false, message: "Kunci API OpenAI salah." })
    }

    // 6. GOOGLE ANALYTICS / MAPS (Ping only)
    if (provider === 'google_maps') {
       if (keys.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return NextResponse.json({ success: true, message: "Kunci Terdeteksi." })
       return NextResponse.json({ success: false, message: "Kunci Kosong." })
    }

    return NextResponse.json({ success: true, message: "Format kunci tersimpan." })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
