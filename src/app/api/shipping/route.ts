import { getProvinces, getCities, calculateShipping } from "@/lib/rajaongkir"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const provinceId = searchParams.get('provinceId')

  try {
    if (type === 'provinces') {
      const data = await getProvinces()
      return NextResponse.json(data)
    }
    if (type === 'cities' && provinceId) {
      const data = await getCities(provinceId)
      return NextResponse.json(data)
    }
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { destination, weight, courier } = await req.json()
    const costs = await calculateShipping(destination, weight, courier)
    return NextResponse.json(costs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
