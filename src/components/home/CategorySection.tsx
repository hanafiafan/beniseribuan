'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  { name: 'Benih Tanaman', slug: 'benih-tanaman', icon: '🌱', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi', icon: '🧪', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { name: 'Media Tanam', slug: 'media-tanam-alat-kebun', icon: '🪴', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  { name: 'Paket Hemat', slug: 'paket-benih-hemat', icon: '📦', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { name: 'Hidroponik', slug: 'hidroponik', icon: '💧', color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400' },
  { name: 'Tabulampot', slug: 'tabulampot', icon: '🍊', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
  { name: 'Alat Kebun', slug: 'peralatan-berkebun', icon: '✂️', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' },
]

export function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4 font-heading">
          Pilih Kategori <span className="text-gradient-brand">Favoritmu</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Mulai petualangan berkebun Anda dengan memilih perlengkapan yang tepat dari koleksi terbaik kami.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={`/toko?category=${cat.slug}`}
              className="group block p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
