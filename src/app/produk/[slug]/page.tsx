'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShieldCheck, Truck, RefreshCw, Minus, Plus, ShoppingCart, Heart, Share2, MessageCircle, Send, Loader2 } from 'lucide-react'
import { cn, formatRupiah, getEstimatedDelivery } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import RecentlyViewed from '@/components/products/RecentlyViewed'
import { useCompareStore } from '@/stores/compareStore'
import { GitCompare } from 'lucide-react'

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
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('deskripsi')
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id || 0))
  
  const { addItem: addToCompare, isInCompare, removeItem: removeFromCompare } = useCompareStore()
  const isCompared = product ? isInCompare(product.id) : false

  useEffect(() => {
    if (!slug) return
    
    // Track view
    fetch(`/api/products/${slug}/view`, { method: 'POST' }).catch(console.error)

    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProduct(data)
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0])
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="font-bold text-slate-400">Memuat detail produk...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Produk Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/toko" className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-black">Kembali ke Toko</Link>
      </div>
    )
  }

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price)
  const normalPrice = Number(product.price)
  const discount = normalPrice > currentPrice ? Math.round(((normalPrice - currentPrice) / normalPrice) * 100) : 0

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      price: currentPrice,
      image: product.images?.[0]?.url || '/images/placeholder.png',
      quantity: quantity,
      stock: selectedVariant?.stock || product.stock,
      weight: selectedVariant?.weight || product.weight,
      isDigital: product.isDigital
    })
    router.push('/checkout')
  }

  const features = [
    { icon: ShieldCheck, title: 'Garansi Tumbuh', desc: 'Benih terseleksi ketat dengan daya tumbuh tinggi.' },
    { icon: Truck, title: 'Pengiriman Cepat', desc: 'Dikirim dalam 24 jam dengan packing aman.' },
    { icon: RefreshCw, title: '7 Hari Pengembalian', desc: 'Garansi uang kembali jika produk rusak.' },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
              <Image 
                src={product.images?.[activeImage]?.url || '/images/placeholder.png'} 
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
              {product.images?.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    activeImage === i ? "border-brand-700 shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Center: Info */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-4">
                <Link href="/toko" className="hover:underline">{product.category?.name || 'Uncategorized'}</Link>
                <span className="text-slate-300">/</span>
                <span>{product.brand}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight font-heading mb-4">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4 fill-current", i >= Math.floor(product.rating) && "text-slate-200")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{product.rating}</span>
                  <span className="text-sm text-slate-400">({product.ratingCount} Ulasan)</span>
                </div>
                <div className="text-sm text-slate-400">
                  Terjual <span className="font-bold text-slate-900">{product.soldCount}+</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-slate-50 border border-slate-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-brand-600">
                  {formatRupiah(currentPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-lg text-slate-300 line-through mb-1 font-bold">
                    {formatRupiah(product.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-600 font-black uppercase tracking-widest">
                Stok Tersedia: {selectedVariant?.stock || product.stock} buah
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Pilih Varian:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-300",
                      selectedVariant?.id === v.id
                        ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                        : "border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-brand-50/50"
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm border border-brand-100/50">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-0.5 uppercase tracking-wide">{feature.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions (Sticky) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 p-8 rounded-[40px] border border-slate-100 bg-white shadow-2xl space-y-8">
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Jumlah:</h3>
                <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-2xl w-fit border border-slate-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors border border-slate-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-600 transition-colors border border-slate-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium">Subtotal</span>
                   <span className="font-black text-slate-900 text-xl font-heading">
                     {formatRupiah(currentPrice * quantity)}
                   </span>
                 </div>
                 <button
                    onClick={() => addItem({
                      productId: product.id,
                      variantId: selectedVariant?.id,
                      name: product.name,
                      variantName: selectedVariant?.name,
                      price: currentPrice,
                      image: product.images?.[0]?.url || '/images/placeholder.png',
                      quantity: quantity,
                      stock: selectedVariant?.stock || product.stock,
                      weight: selectedVariant?.weight || product.weight,
                      isDigital: product.isDigital
                    })}
                    className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-brand-500/20 btn-shimmer"
                 >
                   <ShoppingCart className="w-5 h-5" />
                   Tambah Keranjang
                 </button>
                 <button 
                    onClick={handleBuyNow}
                    className="w-full py-5 bg-white text-brand-600 border-2 border-brand-600 rounded-2xl font-black hover:bg-brand-50 transition-all duration-300"
                 >
                   Beli Langsung
                 </button>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-current text-red-500")} />
                  {isWishlisted ? 'WISH LISTED' : 'WISHLIST'}
                </button>
                <button 
                  onClick={() => isCompared ? removeFromCompare(product.id) : addToCompare(product)}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black transition-colors",
                    isCompared ? "text-brand-600" : "text-slate-500 hover:text-brand-600"
                  )}
                >
                  <GitCompare className="w-4 h-4" />
                  {isCompared ? 'DI BANDINGKAN' : 'BANDINGKAN'}
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    SHARE
                  </button>
                  <AnimatePresence>
                    {isShareOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-2xl flex gap-4"
                      >
                          <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><Share2 className="w-5 h-5" /></button>
                          <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"><MessageCircle className="w-5 h-5" /></button>
                          <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center"><Send className="w-5 h-5" /></button>
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
          <div className="flex border-b border-gray-100 gap-8 mb-12 overflow-x-auto scrollbar-hide">
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
                    ? "border-brand-700 text-brand-700" 
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
                  className="prose prose-brand max-w-none text-gray-600"
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
                     <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Detail Pengiriman</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex justify-between"><span>Berat Produk:</span> <span className="font-bold text-gray-900">{product.weight} gr</span></li>
                          <li className="flex justify-between"><span>Lokasi Pengiriman:</span> <span className="font-bold text-gray-900">Boyolali, Jawa Tengah</span></li>
                          <li className="flex justify-between"><span>Estimasi Tiba:</span> <span className="font-bold text-brand-700">{getEstimatedDelivery(3)}</span></li>
                        </ul>
                     </div>
                     <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Kebijakan Toko</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
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

        <RecentlyViewed />
      </div>
    </div>
  )
}
