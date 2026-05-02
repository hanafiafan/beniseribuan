'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, ShieldCheck, Sparkles, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-12 lg:py-20 min-h-[600px] lg:min-h-[800px] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-brand-400 rounded-full blur-[120px]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-leaf-400 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-8 border border-brand-200 dark:border-brand-800 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Inovasi Berkebun Modern</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 font-heading">
              Tumbuhkan <span className="text-gradient-brand">Kebahagiaan</span> dari Rumah Anda
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-xl">
              Dapatkan benih kualitas premium mulai dari <span className="font-bold text-brand-700 dark:text-brand-400">Rp 1.000</span>. Kami membantu Anda membangun ekosistem pangan mandiri dengan cara yang paling menyenangkan.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link 
                href="/toko" 
                className="w-full sm:w-auto px-8 py-4 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-brand-700/20 hover:-translate-y-1 btn-shimmer"
              >
                Mulai Berkebun Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/tentang-kami" 
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg shadow-black/5"
              >
                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-full flex items-center justify-center text-brand-700 dark:text-brand-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Lihat Cerita Kami
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md">
                   <ShieldCheck className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Garansi Tumbuh</p>
                  <p className="text-xs text-gray-500">Benih terseleksi ketat</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-sm">
                       <div className="w-full h-full bg-brand-200" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    5K+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">5.601+ Pelanggan Puas</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square max-w-[550px] mx-auto">
               {/* Main image background with glass card */}
               <div className="absolute inset-0 bg-gradient-brand rounded-[40px] rotate-6 scale-95 opacity-20 blur-xl" />
               <div className="relative w-full h-full rounded-[40px] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl">
                 <Image 
                   src="/images/hero-bg.png" 
                   alt="Modern Organic Garden" 
                   fill 
                   className="object-cover"
                   priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
               </div>

               {/* Floating glass cards */}
               <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-10 -right-10 z-20 w-48 p-4 rounded-3xl card-glass border border-white/50 shadow-2xl"
               >
                 <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-brand-50">
                    <Image src="/images/hero-product.png" alt="Premium Seeds" fill className="object-cover" />
                 </div>
                 <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">Paket 50 Bibit</p>
                 <div className="flex items-center justify-between">
                   <span className="text-brand-700 dark:text-brand-400 font-bold text-sm">Rp 100.000</span>
                   <div className="w-6 h-6 bg-brand-700 text-white rounded-full flex items-center justify-center">
                     <span className="text-[10px]">+</span>
                   </div>
                 </div>
               </motion.div>

               <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-10 -left-10 z-20 px-6 py-4 rounded-2xl card-glass border border-white/50 shadow-2xl flex items-center gap-4"
               >
                 <div className="w-12 h-12 bg-leaf-100 dark:bg-leaf-900/30 rounded-xl flex items-center justify-center text-leaf-700 dark:text-leaf-400">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">100% Organik</p>
                   <p className="text-xs text-gray-500">Tanpa bahan kimia</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
