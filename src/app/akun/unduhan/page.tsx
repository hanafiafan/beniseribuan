import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, orderItems, products } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { Download, FileText, ExternalLink, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function UnduhanPage() {
  const session = await auth()
  if (!session?.user) redirect('/masuk')

  const userId = Number(session.user.id)

  // Get all paid/completed orders for this user
  const ordersList = await db.select().from(orders).where(
    and(
      eq(orders.userId, userId),
      inArray(orders.status, ['paid', 'completed', 'shipped', 'PAID', 'COMPLETED', 'SHIPPED'])
    )
  )


  const orderIds = ordersList.map(o => o.id)
  
  // Get digital items for these orders
  const itemsWithProducts = orderIds.length > 0 ? await db.select({
    id: orderItems.id,
    orderId: orderItems.orderId,
    productId: orderItems.productId,
    name: orderItems.name,
    product: {
      id: products.id,
      name: products.name,
      slug: products.slug,
      isDigital: products.isDigital,
      downloadFileUrl: products.downloadFileUrl
    }
  })
  .from(orderItems)
  .innerJoin(products, eq(orderItems.productId, products.id))
  .where(
    and(
      inArray(orderItems.orderId, orderIds),
      eq(products.isDigital, true)
    )
  ) : []

  // Combine data
  const digitalItems = itemsWithProducts.map(item => {
    const order = ordersList.find(o => o.id === item.orderId)
    return {
      ...item,
      orderNumber: order?.orderNumber || 'N/A',
      paidAt: order?.createdAt || null
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 font-heading mb-2">Produk Digital</h2>
        <p className="text-slate-500 font-medium">Akses semua panduan dan konten digital yang telah Anda beli.</p>
      </div>

      {digitalItems.length === 0 ? (
        <div className="p-20 rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <FileText className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Unduhan</h3>
           <p className="text-slate-500 max-w-xs mb-8">Anda belum memiliki produk digital. Temukan panduan berkebun eksklusif di toko kami.</p>
           <Link href="/toko?category=digital" className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-500/20">
             Cari Produk Digital
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {digitalItems.map((item) => (
             <div key={item.id} className="group p-6 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-500">
                <div className="flex items-start gap-5">
                   <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <FileText className="w-8 h-8" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 mb-1 truncate">{item.product.name}</h4>
                      <p className="text-xs text-slate-400 font-medium mb-4">Pesanan #{item.orderNumber}</p>
                      
                      <div className="flex items-center gap-2">
                         <a 
                           href={item.product.downloadFileUrl || '#'} 
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-brand-600 transition-all"
                         >
                            <Download className="w-4 h-4" />
                            Unduh Sekarang
                         </a>
                         <Link 
                           href={`/produk/${item.product.slug}`}
                           className="w-12 h-12 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"
                         >
                            <ExternalLink className="w-4 h-4" />
                         </Link>
                      </div>
                   </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-brand-600">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Akses Permanen Terverifikasi</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  )
}
