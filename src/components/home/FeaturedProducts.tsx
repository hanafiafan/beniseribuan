'use client'
import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { ArrowRight, Flame, Package } from 'lucide-react'

import FloatingSeeds from './FloatingSeeds'

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        const raw = Array.isArray(data) ? data : []
        // Filter featured products, or just take latest 4 if none are featured
        let featured = raw.filter((p: any) => p.isFeatured)
        if (featured.length === 0) featured = raw.slice(0, 4)
        else featured = featured.slice(0, 4)

        const mapped = featured.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            image: p.images?.[0]?.url || '/images/hero-product.png',
            stock: p.stock,
            weight: p.weight || 10,
            category: p.category?.name,
            rating: 4.9,
            soldCount: Math.floor(Math.random() * 500) + 200,
          }))
        setProducts(mapped)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      <FloatingSeeds />
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              Produk Terlaris Minggu Ini
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
              Koleksi Benih <span className="text-brand-600">Paling Dicari</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Temukan varian benih favorit komunitas yang terbukti memiliki daya tumbuh tinggi dan hasil panen melimpah.
            </p>
          </div>
          <Link 
            href="/toko" 
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm"
          >
            Lihat Semua
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
             <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold">Belum ada produk unggulan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
