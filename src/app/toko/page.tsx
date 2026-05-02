'use client'
import { useState } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { Filter, Grid, List, Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample data - will be replaced by API calls later
const sampleProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 === 0 
    ? 'Paket 50 Bibit Sayuran Varian Tanaman Lengkap - Benih Seribuan' 
    : 'Pupuk Organik Cair POC Tanaman Cabai & Sayuran Daun 500ml',
  slug: `product-${i + 1}`,
  price: i % 2 === 0 ? 150000 : 50000,
  salePrice: i % 2 === 0 ? 100000 : 35000,
  image: '/images/hero-product.png',
  soldCount: 100 * (i + 1),
  rating: 4.5 + (i % 5) * 0.1,
  stock: 100,
  weight: 500,
  category: i % 3 === 0 ? 'Benih' : i % 3 === 1 ? 'Pupuk' : 'Media Tanam'
}))

const categories = [
  { name: 'Semua Kategori', count: 140 },
  { name: 'Benih Tanaman', count: 85 },
  { name: 'Pupuk & Nutrisi', count: 12 },
  { name: 'Media Tanam', count: 18 },
  { name: 'Alat Kebun', count: 15 },
  { name: 'Paket Hemat', count: 10 },
]

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('Paling Sesuai')

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f0d]">
      {/* Header / Breadcrumb Area */}
      <div className="bg-gray-50 dark:bg-[#0c1210] border-b border-gray-100 dark:border-gray-800 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4 font-heading">
            Toko <span className="text-gradient-brand">Benih Seribuan</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Menampilkan 140 produk berkualitas untuk kebun Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-10">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-700" />
                Kategori
              </h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors group">
                      <span className={cat.name === 'Semua Kategori' ? 'font-bold text-brand-700' : ''}>
                        {cat.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/40">
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Harga</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">RP</span>
                    <input type="number" placeholder="Min" className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-brand-500" />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">RP</span>
                    <input type="number" placeholder="Max" className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-brand-500" />
                  </div>
                </div>
                <button className="w-full py-2 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800 transition-colors">
                  Terapkan
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 group-hover:text-brand-700">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < star ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}>★</span>
                        ))}
                      </div>
                      <span>{star} Ke Atas</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>
                <div className="relative group min-w-[150px]">
                  <button className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium shadow-sm">
                    {sortBy}
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-brand-700 dark:text-brand-400" : "text-gray-400")}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-brand-700 dark:text-brand-400" : "text-gray-400")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
              {sampleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-2">
              <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-400 disabled:opacity-50">Sebelumnya</button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button key={i} className={cn(
                  "w-10 h-10 rounded-xl text-sm font-bold transition-all",
                  page === 1 ? "bg-brand-700 text-white shadow-lg shadow-brand-700/20" : "hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-600 dark:text-gray-400"
                )}>
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20">Selanjutnya</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-black font-heading">Filter</h2>
                <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-10">
                {/* Same filter content as desktop sidebar */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-6">Kategori</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat.name} className="px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 text-xs font-medium hover:border-brand-500 hover:text-brand-700">
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* ... other filters ... */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <button onClick={() => setIsFilterOpen(false)} className="w-full py-4 bg-brand-700 text-white rounded-2xl font-bold">
                    Tampilkan Produk
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
