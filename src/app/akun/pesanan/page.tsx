import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ShoppingBag, ChevronRight, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default async function PesananPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/masuk")

  const userId = Number(session.user.id)
  if (isNaN(userId)) {
    console.error("Invalid User ID in session:", session.user.id)
    return (
      <div className="p-12 text-center bg-red-50 rounded-[32px] border border-red-100">
        <h3 className="text-xl font-black text-red-900 mb-2">Terjadi Kesalahan Sesi</h3>
        <p className="text-red-600 text-sm">ID pengguna tidak valid. Silakan coba keluar dan masuk kembali.</p>
      </div>
    )
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: [desc(orders.createdAt)]
  })

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'pending':
      case 'awaiting_payment':
        return { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-700' }
      case 'paid':
      case 'processing':
        return { label: 'Diproses', bg: 'bg-blue-100', text: 'text-blue-700' }
      case 'shipped':
        return { label: 'Dikirim', bg: 'bg-indigo-100', text: 'text-indigo-700' }
      case 'completed':
      case 'delivered':
        return { label: 'Selesai', bg: 'bg-brand-100', text: 'text-brand-700' }
      case 'cancelled':
        return { label: 'Dibatalkan', bg: 'bg-red-100', text: 'text-red-700' }
      default:
        return { label: status || 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700' }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-1 font-heading tracking-tight">Pesanan Saya</h2>
          <p className="text-slate-500 text-sm font-medium">Pantau status dan riwayat semua pembelian Anda.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
           <ShoppingBag className="w-4 h-4 text-brand-600" />
           <span className="text-xs font-black text-slate-900">{userOrders.length} Pesanan</span>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="p-16 rounded-[48px] bg-slate-50 border border-slate-100 text-center relative overflow-hidden group">
           <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <ShoppingBag className="w-12 h-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-3 font-heading">Belum ada pesanan</h3>
           <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto mb-8 leading-relaxed">
              Sepertinya Anda belum melakukan pembelian apapun. Mari mulai menanam hari ini!
           </p>
           <Link 
             href="/toko" 
             className="inline-flex items-center gap-3 px-8 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all hover:-translate-y-1"
           >
              Mulai Belanja <ChevronRight className="w-5 h-5" />
           </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">No. Pesanan</th>
                   <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tanggal</th>
                   <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                   <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Total Tagihan</th>
                   <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {userOrders.map((order) => {
                   const status = getStatusInfo(order.status)
                   return (
                     <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="p-6 border-b border-slate-50">
                          <span className="font-black text-slate-900">#{order.orderNumber}</span>
                       </td>
                       <td className="p-6 border-b border-slate-50">
                          <span className="text-sm font-bold text-slate-500">
                             {new Date(order.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                       </td>
                       <td className="p-6 border-b border-slate-50">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            status.bg,
                            status.text
                          )}>
                             {status.label}
                          </span>
                       </td>
                       <td className="p-6 border-b border-slate-50">
                          <span className="text-sm font-black text-slate-900">
                             {formatPrice(Number(order.total))}
                          </span>
                       </td>
                       <td className="p-6 border-b border-slate-50">
                          <Link 
                            href={`/akun/pesanan/${order.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all group-hover:shadow-lg group-hover:shadow-brand-500/10"
                          >
                             <Eye className="w-4 h-4" />
                             Lihat Detail
                          </Link>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  )
}
