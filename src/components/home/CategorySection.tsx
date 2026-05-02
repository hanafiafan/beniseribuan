'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sprout, Beaker, Box, Droplets, Scissors, Apple, Shovel } from 'lucide-react'

const categories = [
  { name: 'Benih Tanaman', slug: 'benih-tanaman', icon: Sprout, color: 'bg-green-50 text-green-600' },
  { name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi', icon: Beaker, color: 'bg-blue-50 text-blue-600' },
  { name: 'Media Tanam', slug: 'media-tanam-alat-kebun', icon: Box, color: 'bg-amber-50 text-amber-600' },
  { name: 'Paket Hemat', slug: 'paket-benih-hemat', icon: Box, color: 'bg-purple-50 text-purple-600' },
  { name: 'Hidroponik', slug: 'hidroponik', icon: Droplets, color: 'bg-sky-50 text-sky-600' },
  { name: 'Tabulampot', slug: 'tabulampot', icon: Apple, color: 'bg-orange-50 text-orange-600' },
  { name: 'Alat Kebun', slug: 'peralatan-berkebun', icon: Scissors, color: 'bg-rose-50 text-rose-600' },
]

export function CategorySection() {
  return (
    <section className="container-custom">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
          Pilih Kategori <span className="text-gradient-brand">Favoritmu</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Mulai petualangan berkebun Anda dengan perlengkapan yang tepat dari koleksi terbaik kami.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
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
              className="group block p-4 sm:p-8 bg-white border border-slate-100 text-center h-full rounded-[30px] sm:rounded-[40px] shadow-sm hover:shadow-xl hover:border-brand-100 transition-all duration-500"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl sm:rounded-3xl ${cat.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                <cat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-[10px] sm:text-xs font-black text-slate-700 leading-tight group-hover:text-brand-600 transition-colors uppercase tracking-[0.15em]">
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
