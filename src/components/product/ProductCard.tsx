'use client'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, MapPin, Eye, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatRupiah } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    price: number
    salePrice?: number | null
    image: string
    category?: string
    rating?: number
    soldCount?: number
    location?: string
    stock: number
    weight: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const addItem = useCartStore((s) => s.addItem)

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const displayPrice = product.salePrice || product.price

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative glass-card rounded-[32px] overflow-hidden"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.image} // Using product image
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e: any) => {
            e.target.src = 'https://images.unsplash.com/photo-1592841208389-52317a7027e4?auto=format&fit=crop&q=80&w=600'
          }}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-red-500/30 uppercase tracking-widest">
              -{discount}%
            </span>
          )}
          {product.soldCount && product.soldCount > 100 && (
             <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-500/30 uppercase tracking-widest">
               HOT ITEM
             </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 shadow-lg",
            isWishlisted 
              ? "bg-red-500 text-white" 
              : "bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </button>

        {/* View Detail Overlay */}
        <div className="absolute inset-0 bg-brand-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
           <Link 
             href={`/produk/${product.slug}`}
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-xl scale-90 group-hover:scale-100 transition-all pointer-events-auto"
           >
             <Eye className="w-6 h-6" />
           </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 text-[11px] font-black text-slate-800 dark:text-slate-200">{product.rating || 5.0}</span>
          </div>
          <span className="text-[10px] text-slate-200 dark:text-slate-700 font-bold">|</span>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Terjual {product.soldCount || 0}+</span>
        </div>

        <Link href={`/produk/${product.slug}`} className="block mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[40px] leading-tight group-hover:text-brand-600 transition-colors font-heading">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mulai Dari</p>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-brand-600 font-heading">
                {formatRupiah(displayPrice)}
              </span>
              {product.salePrice && (
                <span className="text-[10px] text-slate-300 dark:text-slate-600 line-through font-bold">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={() => addItem({
              productId: product.id,
              name: product.name,
              price: displayPrice,
              image: product.image,
              quantity: 1,
              stock: product.stock || 100,
              weight: product.weight || 10
            })}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 group/btn"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-brand-500" />
            <span className="dark:text-slate-500">{product.location || 'Boyolali'}</span>
          </div>
          <Link href={`/produk/${product.slug}`} className="text-[9px] font-black text-brand-600 uppercase tracking-widest hover:underline">
            Detail
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
