'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Truck, CreditCard, ChevronRight, ShieldCheck, ShoppingBag, Plus, Info } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'

export default function CheckoutPage() {
  const { items, getTotal, getTotalItems, getTotalWeight } = useCartStore()
  const [activeStep, setActiveStep] = useState(1)
  
  const subtotal = getTotal()
  const shippingCost = 15000 // Sample
  const total = subtotal + shippingCost

  if (items.length === 0) {
     return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f0d] pb-24">
      {/* Checkout Header (Minimal) */}
      <div className="bg-white dark:bg-[#0c1210] border-b border-gray-100 dark:border-gray-800 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
           <Link href="/keranjang" className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold">
              <ChevronRight className="w-5 h-5 rotate-180" />
              Kembali ke Keranjang
           </Link>
           <h1 className="text-xl font-black font-heading uppercase tracking-widest text-gray-900 dark:text-white">Checkout</h1>
           <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Shipping Address Section */}
            <div className="p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black font-heading flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-700" />
                  Alamat Pengiriman
                </h3>
                <button className="text-sm font-bold text-brand-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Tambah Alamat
                </button>
              </div>
              
              <div className="p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-900/10 border-2 border-brand-700 dark:border-brand-600 relative">
                 <div className="absolute top-6 right-6 px-2 py-1 bg-brand-700 text-white text-[10px] font-bold rounded">UTAMA</div>
                 <h4 className="font-bold text-gray-900 dark:text-white mb-2">As'ad RUN (Rumah)</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">081-211-8822</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                   Dk. Tegalsari, Tegal Sari, Tambak, Kec. Mojosongo, Kabupaten Boyolali, Jawa Tengah 57322
                 </p>
                 <button className="mt-6 text-sm font-bold text-brand-700 hover:underline">Ganti Alamat</button>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div className="p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-8">
                <Truck className="w-5 h-5 text-brand-700" />
                Pilih Kurir
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { id: 'jne', name: 'JNE REG', price: 15000, desc: 'Estimasi 2-3 hari' },
                   { id: 'jnt', name: 'J&T Express', price: 12000, desc: 'Estimasi 1-2 hari' },
                 ].map((courier) => (
                   <button 
                     key={courier.id}
                     className={cn(
                       "p-6 rounded-3xl border-2 text-left transition-all duration-300",
                       courier.id === 'jne' ? "border-brand-700 bg-brand-50/30 dark:bg-brand-900/10" : "border-gray-100 dark:border-gray-700 hover:border-brand-300"
                     )}
                   >
                     <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-gray-900 dark:text-white">{courier.name}</span>
                       <span className="text-sm font-black text-brand-700">{formatRupiah(courier.price)}</span>
                     </div>
                     <p className="text-xs text-gray-500">{courier.desc}</p>
                   </button>
                 ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-8">
                <CreditCard className="w-5 h-5 text-brand-700" />
                Metode Pembayaran
              </h3>
              <div className="space-y-4">
                 {[
                   { id: 'xendit', name: 'Pembayaran Instan (Virtual Account, E-Wallet, QRIS)', desc: 'Otomatis terverifikasi via Xendit' },
                   { id: 'cod', name: 'Bayar di Tempat (COD)', desc: 'Bayar saat paket sampai di rumah Anda' },
                 ].map((method) => (
                   <button 
                     key={method.id}
                     className={cn(
                       "w-full p-6 rounded-3xl border-2 text-left transition-all duration-300 flex items-center justify-between gap-4",
                       method.id === 'xendit' ? "border-brand-700 bg-brand-50/30 dark:bg-brand-900/10" : "border-gray-100 dark:border-gray-700"
                     )}
                   >
                     <div>
                       <span className="block font-bold text-gray-900 dark:text-white mb-1">{method.name}</span>
                       <p className="text-xs text-gray-500">{method.desc}</p>
                     </div>
                     <div className={cn(
                       "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                       method.id === 'xendit' ? "border-brand-700 bg-brand-700" : "border-gray-300"
                     )}>
                       {method.id === 'xendit' && <div className="w-2 h-2 bg-white rounded-full" />}
                     </div>
                   </button>
                 ))}
              </div>
            </div>

            {/* Product Summary Section */}
            <div className="p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-8">
                <ShoppingBag className="w-5 h-5 text-brand-700" />
                Pesanan Anda
              </h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.productId} className="py-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 relative shrink-0">
                       <Image src={item.image || '/images/hero-product.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
               <div className="p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl space-y-8">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white font-heading">Ringkasan Pembayaran</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ongkos Kirim</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatRupiah(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Asuransi Pengiriman</span>
                      <span>Gratis</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total Tagihan</span>
                      <span className="text-3xl font-black text-brand-700 dark:text-brand-400">
                        {formatRupiah(total)}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-brand-700/20 btn-shimmer">
                    Buat Pesanan
                  </button>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                     <ShieldCheck className="w-6 h-6 text-brand-700" />
                     <p className="text-[11px] text-gray-500 leading-relaxed">
                       Pesanan Anda dilindungi oleh <span className="font-bold text-brand-700">BSB Protection</span>. Jaminan uang kembali jika barang tidak sesuai.
                     </p>
                  </div>
               </div>
               
               <div className="p-6 rounded-[32px] bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 flex gap-4">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                  <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                    Pastikan alamat dan nomor telepon sudah benar sebelum membuat pesanan. Pesanan yang sudah diproses tidak dapat dibatalkan.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
