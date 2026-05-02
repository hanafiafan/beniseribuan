import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronLeft, Package, Truck, CheckCircle2, 
  Clock, CreditCard, MapPin, Receipt, ExternalLink,
  Printer, MessageSquare
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import InvoiceButton from "@/components/orders/InvoiceButton"

interface OrderDetailPageProps {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/masuk")

  const orderId = Number(params.id)
  if (isNaN(orderId)) notFound()

  const orderData = await db.query.orders.findFirst({
    where: and(
      eq(orders.id, orderId),
      eq(orders.userId, Number(session.user.id))
    ),
    with: {
      items: true
    }
  })

  if (!orderData) notFound()

  const steps = [
    { id: 'pending', label: 'Dipesan', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'paid', label: 'Dibayar', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'processing', label: 'Diproses', icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'shipped', label: 'Dikirim', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'completed', label: 'Selesai', icon: CheckCircle2, color: 'text-brand-600', bg: 'bg-brand-50' },
  ]

  const getCurrentStepIndex = () => {
    const status = orderData.status
    if (status === 'pending' || status === 'awaiting_payment') return 0
    if (status === 'paid') return 1
    if (status === 'processing') return 2
    if (status === 'shipped') return 3
    if (status === 'delivered' || status === 'completed') return 4
    if (status === 'cancelled' || status === 'failed' || status === 'refunded') return -1
    return 0
  }

  const currentStepIndex = getCurrentStepIndex()
  const isCancelled = ['cancelled', 'failed', 'refunded'].includes(orderData.status || '')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/akun/pesanan" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-700 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Pesanan
          </Link>
          <h1 className="text-3xl font-black text-gray-900 font-heading">
            Pesanan #{orderData.orderNumber}
          </h1>
          <p className="text-gray-500 mt-1">Dipesan pada {new Date(orderData.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <InvoiceButton order={orderData} />
          <Link 
            href={`/lacak-pesanan?id=${orderData.orderNumber}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
          >
            Lacak Paket
          </Link>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50" />
        
        {isCancelled ? (
          <div className="flex items-center gap-4 text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100">
            <CheckCircle2 className="w-6 h-6 rotate-180" />
            <div>
               <p className="font-black uppercase tracking-widest text-xs">Status Pesanan</p>
               <p className="text-lg font-bold">Pesanan ini telah {orderData.status === 'cancelled' ? 'Dibatalkan' : 'Gagal'}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block" />
            <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex
                const isActive = idx === currentStepIndex
                const StepIcon = step.icon

                return (
                  <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:text-center md:flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isCompleted ? step.bg + " " + step.color : "bg-gray-50 text-gray-300",
                      isActive && "ring-4 ring-offset-4 " + (step.id === 'completed' ? "ring-brand-100" : "ring-gray-50")
                    )}>
                      <StepIcon className={cn("w-6 h-6", isActive && "animate-pulse")} />
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-black uppercase tracking-widest mb-0.5",
                        isCompleted ? step.color : "text-gray-300"
                      )}>
                        {step.label}
                      </p>
                      {isActive && <p className="text-[10px] font-bold text-gray-400">Status Saat Ini</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details (Main) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Item List */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-bottom border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Daftar Produk
              </h3>
              <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500">
                {orderData.items.length} Produk
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {orderData.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-6 hover:bg-gray-50/50 transition-colors">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative">
                    <Image 
                      src={item.image || '/images/placeholder.png'} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      {item.variantName && (
                        <p className="text-xs font-bold text-brand-600 mt-1 uppercase tracking-widest">Varian: {item.variantName}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm font-bold text-gray-400">
                        {item.quantity} x {formatPrice(Number(item.price))}
                      </p>
                      <p className="font-black text-gray-900">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid md:grid-cols-2 gap-8">
             <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  Alamat Pengiriman
                </h3>
                <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-gray-50 space-y-1">
                      <p className="font-black text-gray-900">{(orderData.shippingAddress as any)?.recipientName}</p>
                      <p className="text-sm font-bold text-gray-500">{(orderData.shippingAddress as any)?.phone}</p>
                   </div>
                   <p className="text-sm text-gray-600 leading-relaxed">
                      {(orderData.shippingAddress as any)?.address}, {(orderData.shippingAddress as any)?.district}, 
                      {(orderData.shippingAddress as any)?.city}, {(orderData.shippingAddress as any)?.province}, {(orderData.shippingAddress as any)?.postalCode}
                   </p>
                </div>
             </div>

             <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  Informasi Pembayaran
                </h3>
                <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metode</p>
                        <p className="font-bold text-gray-900">{orderData.paymentMethod || 'Transfer Bank'}</p>
                      </div>
                      <div className="text-right">
                         <span className={cn(
                           "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                           orderData.status === 'paid' ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"
                         )}>
                            {orderData.status === 'paid' ? 'LUNAS' : 'PENDING'}
                         </span>
                      </div>
                   </div>
                   {orderData.paidAt && (
                     <p className="text-xs text-gray-500 text-center">
                        Dibayar pada {new Date(orderData.paidAt).toLocaleString('id-ID')}
                     </p>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Summary (Sticky) */}
        <div className="space-y-8">
           <div className="p-8 rounded-3xl bg-brand-900 text-white shadow-xl shadow-brand-900/20 space-y-6 sticky top-24">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 opacity-50" />
                Ringkasan Tagihan
              </h3>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-sm">
                   <span className="text-brand-300">Subtotal Produk</span>
                   <span className="font-bold">{formatPrice(Number(orderData.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-brand-300">Ongkos Kirim ({orderData.shippingService})</span>
                   <span className="font-bold">{formatPrice(Number(orderData.shippingCost))}</span>
                </div>
                {Number(orderData.discount) > 0 && (
                  <div className="flex justify-between text-sm text-amber-400">
                    <span>Diskon Voucher</span>
                    <span className="font-bold">-{formatPrice(Number(orderData.discount))}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t border-brand-800 flex justify-between items-end">
                   <span className="text-sm font-bold text-brand-200">Total Dibayar</span>
                   <span className="text-3xl font-black">{formatPrice(Number(orderData.total))}</span>
                </div>
              </div>

              {orderData.status === 'pending' && (
                <button className="w-full py-4 rounded-2xl bg-white text-brand-900 font-black text-lg hover:bg-brand-50 transition-all shadow-lg">
                  Bayar Sekarang
                </button>
              )}
              
              <div className="pt-4 space-y-3">
                 <button className="w-full py-3 rounded-xl bg-brand-800 text-brand-200 text-xs font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Butuh bantuan? Chat CS
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
