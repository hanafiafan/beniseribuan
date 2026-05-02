'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShieldCheck, Truck, RefreshCw, Minus, Plus, ShoppingCart, Heart, Share2, Facebook, MessageCircle, Twitter } from 'lucide-react'
import { cn, formatRupiah, getEstimatedDelivery } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

// Sample data
const product = {
  id: 1,
  name: 'Paket 50 Bibit Sayuran Varian Tanaman Lengkap - Benih Seribuan',
  slug: 'paket-50-bibit-sayuran',
  price: 150000,
  salePrice: 100000,
  images: [
    '/images/hero-product.png',
    '/images/hero-bg.png',
    '/images/hero-product.png',
    '/images/hero-bg.png',
  ],
  sku: 'BSB-PKT-50',
  category: 'Paket Benih Hemat',
  brand: 'Benih Seribuan',
  stock: 100,
  weight: 500,
  rating: 4.9,
  ratingCount: 128,
  soldCount: 500,
  description: `
    <p>Paket bundling benih sayuran premium ini menawarkan 50 jenis sayuran unggulan yang lezat, sehat, dan memiliki kualitas terbaik untuk ditanam di kebun Anda. Dari seledri hingga bayam, tomat hingga cabai, Anda akan menemukan berbagai benih sayuran yang akan memperkaya kebun Anda dan memperluas variasi menu makanan Anda.</p>
    <br/>
    <p><strong>Isi Paket:</strong></p>
    <ul>
      <li>50 Jenis Benih Sayuran Lengkap (repack harga seribuan)</li>
      <li>Polybag 25x25 cm (250 gr)</li>
      <li>FREE GIFT: 3 Mystery Seeds</li>
    </ul>
  `,
  variants: [
    { id: 1, name: 'Paket Komplit', price: 100000, stock: 50 },
    { id: 2, name: 'Paket Hemat Menanam', price: 125000, stock: 30 },
    { id: 3, name: 'Paket Hobi Berkebun', price: 150000, stock: 20 },
  ],
  features: [
    { icon: ShieldCheck, title: 'Garansi Tumbuh', desc: 'Benih terseleksi ketat dengan daya tumbuh tinggi.' },
    { icon: Truck, title: 'Pengiriman Cepat', desc: 'Dikirim dalam 24 jam dengan packing aman.' },
    { icon: RefreshCw, title: '7 Hari Pengembalian', desc: 'Garansi uang kembali jika produk rusak.' },
  ]
}

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('deskripsi')
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))

  const discount = Math.round(((product.price - selectedVariant.price) / product.price) * 100)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f0d] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm">
              <Image 
                src={product.images[activeImage]} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20">
                  DISKON {discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    activeImage === i ? "border-brand-700 shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Center: Info */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest mb-4">
                <Link href="/toko" className="hover:underline">{product.category}</Link>
                <span>/</span>
                <span>{product.brand}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight font-heading mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4 fill-current", i >= Math.floor(product.rating) && "text-gray-200 dark:text-gray-700")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.ratingCount} Ulasan)</span>
                </div>
                <div className="text-sm text-gray-400">
                  Terjual <span className="font-bold text-gray-900 dark:text-white">{product.soldCount}+</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[32px] bg-gray-50 dark:bg-[#0c1210] border border-gray-100 dark:border-gray-800">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-brand-700 dark:text-brand-400">
                  {formatRupiah(selectedVariant.price)}
                </span>
                {discount > 0 && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatRupiah(product.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-500 font-bold">
                Tersedia Stok: {selectedVariant.stock} buah
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Pilih Varian:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-300",
                      selectedVariant.id === v.id
                        ? "border-brand-700 bg-brand-700 text-white shadow-lg shadow-brand-700/20"
                        : "border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-brand-300"
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {product.features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-brand-700 dark:text-brand-400 shadow-sm">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions (Sticky) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Atur Jumlah:</h3>
                <div className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-brand-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-brand-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Subtotal</span>
                   <span className="font-black text-gray-900 dark:text-white text-lg">
                     {formatRupiah(selectedVariant.price * quantity)}
                   </span>
                 </div>
                 <button
                    onClick={() => addItem({
                      productId: product.id,
                      variantId: selectedVariant.id,
                      name: product.name,
                      variantName: selectedVariant.name,
                      price: selectedVariant.price,
                      image: product.images[0],
                      quantity: quantity,
                      stock: selectedVariant.stock,
                      weight: product.weight
                    })}
                    className="w-full py-4 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-brand-700/20 btn-shimmer"
                 >
                   <ShoppingCart className="w-5 h-5" />
                   Tambah Keranjang
                 </button>
                 <button className="w-full py-4 bg-white dark:bg-gray-800 text-brand-700 dark:text-brand-400 border-2 border-brand-700 dark:border-brand-600 rounded-2xl font-bold hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-300">
                   Beli Langsung
                 </button>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current text-red-500")} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <AnimatePresence>
                    {isShareOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl flex gap-4"
                      >
                         <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><Facebook className="w-5 h-5" /></button>
                         <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"><MessageCircle className="w-5 h-5" /></button>
                         <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center"><Twitter className="w-5 h-5" /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Area: Tabs & Description */}
        <div className="mt-24">
          <div className="flex border-b border-gray-100 dark:border-gray-800 gap-8 mb-12 overflow-x-auto scrollbar-hide">
            {[
              { id: 'deskripsi', label: 'Deskripsi' },
              { id: 'info', label: 'Informasi Tambahan' },
              { id: 'ulasan', label: `Ulasan (${product.ratingCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-6 text-lg font-bold border-b-4 transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.id 
                    ? "border-brand-700 text-brand-700 dark:text-brand-400" 
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              {activeTab === 'deskripsi' && (
                <motion.div
                  key="deskripsi"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose prose-brand dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Detail Pengiriman</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex justify-between"><span>Berat Produk:</span> <span className="font-bold text-gray-900 dark:text-white">{product.weight} gr</span></li>
                          <li className="flex justify-between"><span>Lokasi Pengiriman:</span> <span className="font-bold text-gray-900 dark:text-white">Boyolali, Jawa Tengah</span></li>
                          <li className="flex justify-between"><span>Estimasi Tiba:</span> <span className="font-bold text-brand-700 dark:text-brand-400">{getEstimatedDelivery(3)}</span></li>
                        </ul>
                     </div>
                     <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Kebijakan Toko</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2 text-green-600 font-bold">✓ Ready Stock & Selalu Baru</li>
                          <li className="flex items-center gap-2 text-green-600 font-bold">✓ Gratis Packing Bubble Wrap</li>
                          <li className="flex items-center gap-2 text-green-600 font-bold">✓ Retur Jika Salah Kirim</li>
                        </ul>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
