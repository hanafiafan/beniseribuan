'use client'
import { useState, useEffect } from 'react'
import { Heart, Loader2, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlistStore'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'

export default function WishlistPage() {
  const { items: wishlistIds, clear: clearWishlist } = useWishlistStore()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlistIds.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/products/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: wishlistIds })
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [wishlistIds])

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">Wishlist Saya</h2>
          <p className="text-slate-500 font-medium">Koleksi benih impian Anda yang siap ditanam.</p>
        </div>
        <div className="flex items-center gap-4">
          {wishlistIds.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
          <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-brand-50 rounded-2xl border border-brand-100">
            <Heart className="w-5 h-5 text-brand-600 fill-current" />
            <span className="text-sm font-black text-brand-700">{wishlistIds.length} Produk</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
           <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-600" />
           <p className="text-sm font-black uppercase tracking-widest">Membuka Daftar Impian...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-16 sm:p-24 rounded-[64px] bg-white border border-slate-100 text-center relative overflow-hidden group shadow-sm">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 blur-[100px] rounded-full -mr-32 -mt-32 opacity-50" />
           <div className="relative z-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                 <Heart className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 font-heading">Wishlist Masih Kosong</h3>
              <p className="text-slate-500 font-medium text-base max-w-sm mx-auto mb-10 leading-relaxed">
                 Tampaknya Anda belum menandai benih favorit. Jelajahi toko kami dan temukan yang terbaik!
              </p>
              <Link 
                href="/toko" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Mulai Belanja
              </Link>
           </div>
        </div>
      )}
    </div>
  )
}

