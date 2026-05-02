import { auth } from "@/auth"
import { db } from "@/lib/db"
import { addresses } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { MapPin, Plus } from 'lucide-react'
import AddressManager from "@/components/addresses/AddressManager"

export default async function AlamatPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/masuk")

  const userAddresses = await db.query.addresses.findMany({
    where: eq(addresses.userId, Number(session.user.id)),
    orderBy: [desc(addresses.isDefault), desc(addresses.createdAt)]
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading tracking-tight">Daftar Alamat</h2>
        <p className="text-slate-500 font-medium text-sm">Simpan berbagai alamat pengiriman untuk mempermudah proses checkout Anda.</p>
      </div>

      <AddressManager initialAddresses={userAddresses} />
    </div>
  )
}
