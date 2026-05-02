'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Ticket } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getTotalItems, getTotalWeight, clearCart } = useCartStore()
  
  const total = getTotal()
  const weight = getTotalWeight()
  const itemCount = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-50 rounded-[32px] flex items-center justify-center text-brand-600 mb-8 animate-bounce-soft">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 font-heading">Keranjang Kosong</h1>
        <p className="text-slate-500 mb-10 text-center max-w-sm font-medium">
          Wah, sepertinya Anda belum memilih benih untuk kebun Anda. Yuk, mulai cari produk favoritmu!
        </p>
        <Link 
          href="/toko" 
          className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-brand-500/20"
        >
          Mulai Belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-10 font-heading">
          Keranjang <span className="text-gradient-brand">Belanja</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex items-center gap-2">
                 <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                 <span className="text-sm font-bold text-gray-900">Pilih Semua ({itemCount})</span>
               </div>
               <button onClick={clearCart} className="text-sm font-bold text-red-500 hover:underline">Hapus Semua</button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 relative group"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <Image src={item.image || '/images/hero-product.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link href={`/produk/slug`} className="block group-hover:text-brand-700 transition-colors">
                          <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate">
                            {item.name}
                          </h3>
                        </Link>
                        {item.variantName && (
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.variantName}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 sm:mt-0">
                        <span className="text-lg font-black text-brand-700">
                          {formatRupiah(item.price)}
                        </span>
                        
                        <div className="flex items-center gap-4 p-1.5 bg-gray-50 rounded-xl">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-brand-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-brand-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Promo Code */}
              <div className="p-6 rounded-[32px] border border-gray-100 bg-white shadow-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-700" />
                  Gunakan Promo
                </h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Masukkan kode promo" className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-brand-500" />
                  <button className="px-6 py-3 bg-brand-700 text-white rounded-xl text-sm font-bold">Cek</button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-8 rounded-[40px] border border-gray-100 bg-white shadow-2xl space-y-6">
                <h3 className="text-xl font-black text-gray-900 font-heading">Ringkasan Belanja</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Harga ({itemCount} barang)</span>
                    <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Berat</span>
                    <span className="font-bold text-gray-900">{(weight / 1000).toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Diskon</span>
                    <span>- {formatRupiah(0)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Tagihan</span>
                    <span className="text-2xl font-black text-brand-700">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full py-5 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-brand-700/20 btn-shimmer"
                >
                  Beli ({itemCount})
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-50 border border-brand-100">
                   <ShieldCheck className="w-6 h-6 text-brand-700" />
                   <p className="text-[11px] text-brand-800 font-medium">
                     Pembayaran Aman & Terenkripsi. Garansi 100% uang kembali jika produk tidak sampai.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
