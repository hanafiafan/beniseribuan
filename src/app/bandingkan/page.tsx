'use client'

import { useCompareStore } from '@/stores/compareStore'
import { motion } from 'framer-motion'
import { GitCompare, X, ShoppingCart, ArrowLeft, Star, Package, Scale, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { useEffect, useState } from 'react'

export default function ComparePage() {
  const { items, removeItem, clear } = useCompareStore()
  const addItem = useCartStore((s) => s.addItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
           <GitCompare className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 font-heading tracking-tight">Daftar Banding Kosong</h1>
        <p className="text-slate-500 mb-10 max-w-md font-medium leading-relaxed">
          Pilih beberapa benih dari toko kami untuk membandingkan spesifikasi dan harganya secara detail.
        </p>
        <Link 
          href="/toko" 
          className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
        >
          Mulai Belanja
        </Link>
      </div>
    )
  }

  const specs = [
    { key: 'price', label: 'Harga', icon: null },
    { key: 'stock', label: 'Stok', icon: Package },
    { key: 'weight', label: 'Berat', icon: Scale },
    { key: 'rating', label: 'Rating', icon: Star },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <Breadcrumbs />
           <h1 className="text-4xl font-black text-slate-900 font-heading tracking-tight">Perbandingan Produk</h1>
           <p className="text-slate-500 font-medium">Bandingkan spesifikasi benih untuk menemukan yang terbaik bagi kebun Anda.</p>
        </div>
        <button 
          onClick={clear}
          className="px-6 py-3 border-2 border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Hapus Semua
        </button>
      </div>

      <div className="overflow-x-auto pb-10">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-5 border-b border-slate-100">
             {/* Labels Column */}
             <div className="p-8 bg-slate-50 rounded-tl-[40px]">
                <div className="h-[280px]" /> {/* Spacer for header */}
                <div className="space-y-16">
                   {specs.map(spec => (
                     <div key={spec.key} className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        {spec.icon && <spec.icon className="w-4 h-4" />}
                        {spec.label}
                     </div>
                   ))}
                </div>
             </div>

             {/* Product Columns */}
             {items.map((product, i) => (
                <div key={product.id} className={cn(
                  "p-8 border-l border-slate-100 relative group",
                  i === items.length - 1 && "rounded-tr-[40px]"
                )}>
                   <button 
                     onClick={() => removeItem(product.id)}
                     className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                   >
                     <X className="w-4 h-4" />
                   </button>

                   {/* Header */}
                   <div className="h-[280px] mb-16 text-center">
                      <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-white mb-6 group-hover:shadow-xl transition-all">
                         <Image src={product.images?.[0]?.url || '/images/placeholder.png'} alt={product.name} fill className="object-cover" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-brand-600 transition-colors">
                        <Link href={`/produk/${product.slug}`}>{product.name}</Link>
                      </h3>
                   </div>

                   {/* Specs */}
                   <div className="space-y-12 text-center">
                      {/* Price */}
                      <div className="h-10 flex flex-col items-center justify-center">
                         <span className="text-xl font-black text-brand-600">{formatRupiah(product.salePrice || product.price)}</span>
                         {product.salePrice && <span className="text-xs text-slate-300 line-through font-bold">{formatRupiah(product.price)}</span>}
                      </div>

                      {/* Stock */}
                      <div className="h-10 flex items-center justify-center font-bold text-slate-700">
                         {product.stock} pcs
                      </div>

                      {/* Weight */}
                      <div className="h-10 flex items-center justify-center font-bold text-slate-700">
                         {product.weight} gr
                      </div>

                      {/* Rating */}
                      <div className="h-10 flex flex-col items-center justify-center">
                         <div className="flex text-amber-500 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3 fill-current", i >= Math.floor(product.rating) && "text-slate-100")} />
                            ))}
                         </div>
                         <span className="text-[10px] font-black text-slate-400">({product.ratingCount})</span>
                      </div>

                      {/* Add to Cart */}
                      <div className="pt-8">
                         <button 
                           onClick={() => addItem({
                             productId: product.id,
                             name: product.name,
                             price: Number(product.salePrice || product.price),
                             image: product.images?.[0]?.url || '/images/placeholder.png',
                             quantity: 1,
                             stock: product.stock,
                             weight: product.weight
                           })}
                           className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                         >
                            <ShoppingCart className="w-4 h-4" />
                            Tambah
                         </button>
                      </div>
                   </div>
                </div>
             ))}

             {/* Fill empty columns if less than 4 items */}
             {items.length < 4 && Array.from({ length: 4 - items.length }).map((_, i) => (
                <div key={`empty-${i}`} className="p-8 border-l border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-100 flex items-center justify-center text-slate-100">
                      <Plus className="w-8 h-8" />
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
