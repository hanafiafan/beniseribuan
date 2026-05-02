'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatRupiah } from '@/lib/utils'
import { Loader2, History } from 'lucide-react'

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products/recently-viewed')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return null
  if (products.length === 0) return null

  return (
    <section className="mt-32">
      <div className="flex items-center justify-between mb-10">
        <div>
           <div className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest mb-2">
              <History className="w-4 h-4" />
              Berdasarkan Riwayat Anda
           </div>
           <h2 className="text-3xl font-black text-slate-900 font-heading">Terakhir Dilihat</h2>
        </div>
        <Link href="/toko" className="text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors">Lihat Semua Produk</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map((item, i) => {
          const product = item.product
          const price = Number(product.price)
          const salePrice = product.salePrice ? Number(product.salePrice) : null
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/produk/${product.slug}`} className="block">
                <div className="relative aspect-square rounded-[32px] overflow-hidden border border-slate-100 bg-slate-50 mb-4 group-hover:shadow-2xl group-hover:shadow-brand-500/10 transition-all duration-500">
                  <Image 
                    src={product.images?.[0]?.url || '/images/placeholder.png'} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors h-10">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-black text-brand-600">
                    {formatRupiah(salePrice || price)}
                  </span>
                  {salePrice && (
                    <span className="text-[10px] text-slate-300 line-through font-bold">
                      {formatRupiah(price)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
