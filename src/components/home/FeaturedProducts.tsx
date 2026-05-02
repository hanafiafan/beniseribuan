'use client'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const sampleProducts = [
  {
    id: 1,
    name: 'Paket 50 Bibit Sayuran Varian Tanaman Lengkap - Benih Seribuan',
    slug: 'paket-50-bibit-sayuran',
    price: 150000,
    salePrice: 100000,
    image: '/images/hero-product.png',
    soldCount: 500,
    rating: 4.9,
    stock: 100,
    weight: 500,
  },
  {
    id: 2,
    name: 'Pupuk Organik Cair POC Tanaman Cabai & Sayuran Daun 500ml',
    slug: 'pupuk-organik-cair-500ml',
    price: 50000,
    salePrice: 35000,
    image: '/images/hero-bg.png', // Temporary placeholder
    soldCount: 1200,
    rating: 4.8,
    stock: 50,
    weight: 600,
  },
  {
    id: 3,
    name: 'Benih Cabai Rawit Unggul - Isi 50 Biji Benih Seribuan',
    slug: 'benih-cabai-rawit',
    price: 5000,
    salePrice: 1000,
    image: '/images/hero-product.png',
    soldCount: 3400,
    rating: 5.0,
    stock: 1000,
    weight: 10,
  },
  {
    id: 4,
    name: 'Media Tanam Siap Pakai Premium Campuran Sekam Bakar & Kompos',
    slug: 'media-tanam-premium',
    price: 25000,
    image: '/images/hero-bg.png',
    soldCount: 800,
    rating: 4.7,
    stock: 200,
    weight: 5000,
  }
]

export function FeaturedProducts() {
  return (
    <section className="bg-gray-50 dark:bg-[#0c1210] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-xs font-bold mb-4">
              🔥 PRODUK PILIHAN
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4 font-heading">
              Benih <span className="text-gradient-brand">Terlaris</span> Pekan Ini
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Produk-produk pilihan yang paling banyak dicari oleh komunitas Benih Seribuan.
            </p>
          </div>
          <Link 
            href="/toko" 
            className="group flex items-center gap-2 font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
          >
            Lihat Semua Produk
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
