'use client'
import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { Filter, Grid, List, Search, ChevronDown, SlidersHorizontal, X, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('Paling Sesuai')

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        // Map real data to ProductCard props
        const mapped = (Array.isArray(data) ? data : []).map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          image: p.images?.[0]?.url || '/images/hero-product.png',
          stock: p.stock,
          weight: p.weight || 10,
          category: p.category?.name,
          rating: 4.8,
          soldCount: Math.floor(Math.random() * 500) + 100, // Simulated
        }))
        setProducts(mapped)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Breadcrumb Area */}
      <div className="bg-brand-50/50 border-b border-brand-100 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 font-heading tracking-tight">
            Toko <span className="text-brand-600">Benih Seribuan</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Menampilkan koleksi benih premium dan kebutuhan berkebun terbaik untuk Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-12">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-600" />
                Kategori
              </h3>
              <ul className="space-y-4">
                {['Semua Kategori', 'Benih Sayuran', 'Benih Buah', 'Pupuk', 'Alat Kebun'].map((cat) => (
                  <li key={cat}>
                    <button className="flex items-center justify-between w-full text-sm font-bold text-slate-600 hover:text-brand-600 transition-all group">
                      <span className={cat === 'Semua Kategori' ? 'text-brand-600 font-black' : ''}>
                        {cat}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* ... other filters ... */}
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  Filter
                </button>
                <div className="relative group">
                  <button className="flex items-center justify-between gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black shadow-sm min-w-[180px]">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Urutkan:</span>
                    {sortBy}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white shadow-md text-brand-600" : "text-slate-400 hover:text-slate-600")}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-white shadow-md text-brand-600" : "text-slate-400 hover:text-slate-600")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                 <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-900">Produk Tidak Ditemukan</h3>
                 <p className="text-slate-500 mt-2">Maaf, saat ini belum ada produk yang tersedia.</p>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6 sm:gap-8",
                viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="mt-20 flex flex-wrap items-center justify-center gap-3">
                <button className="px-6 py-3 rounded-2xl border border-slate-100 text-sm font-black text-slate-400 disabled:opacity-50">PREV</button>
                <button className="w-12 h-12 rounded-2xl text-sm font-black bg-brand-600 text-white shadow-xl shadow-brand-500/20">1</button>
                <button className="px-6 py-3 rounded-2xl border border-slate-100 text-sm font-black text-brand-600 hover:bg-brand-50">NEXT</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
