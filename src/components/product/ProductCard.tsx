'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, MapPin } from 'lucide-react'
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
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-[24px] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Product Image */}
      <Link href={`/produk/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
              -{discount}%
            </span>
          )}
          {product.soldCount && product.soldCount > 100 && (
             <span className="px-2 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-lg shadow-lg">
               Terlaris
             </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/produk/${product.slug}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[40px] leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-black text-brand-700 dark:text-brand-400">
            {formatRupiah(displayPrice)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatRupiah(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3 text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-0.5 font-bold text-gray-700 dark:text-gray-300">{product.rating || 4.8}</span>
          </div>
          <span className="text-gray-300">|</span>
          <span>Terjual {product.soldCount || 0}+</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-4">
          <MapPin className="w-3 h-3" />
          <span>{product.location || 'Boyolali'}</span>
        </div>

        <button
          onClick={() => addItem({
            productId: product.id,
            name: product.name,
            price: displayPrice,
            image: product.image,
            quantity: 1,
            stock: product.stock,
            weight: product.weight
          })}
          className="w-full py-2.5 rounded-xl border-2 border-brand-700 dark:border-brand-600 text-brand-700 dark:text-brand-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-700 hover:text-white dark:hover:bg-brand-600 transition-all duration-300"
        >
          <ShoppingCart className="w-4 h-4" />
          Tambah Keranjang
        </button>
      </div>
    </motion.div>
  )
}
