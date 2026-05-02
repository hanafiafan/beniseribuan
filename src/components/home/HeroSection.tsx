'use client'
import { motion } from 'framer-motion'
import { Leaf, ChevronRight, Play, Star, ShieldCheck, Zap, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import GlassBackground from './GlassBackground'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20">
      {/* Dynamic Background Elements */}
      <GlassBackground />
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-leaf-200/20 blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 shadow-sm border border-brand-100/50">
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce-soft" />
              <span>Premium Seeds Collection 2024</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 sm:mb-8 font-heading tracking-tight">
              Ubah Rumahmu Menjadi <br />
              <span className="text-brand-600">Surga Hijau</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-xl leading-relaxed font-medium">
              Ekosistem berkebun terlengkap untuk semua orang. Temukan benih sayuran, buah, dan bunga berkualitas tinggi mulai dari Rp 1.000.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/toko"
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-brand-600 text-white font-black rounded-[20px] shadow-2xl shadow-brand-500/40 hover:scale-105 hover:bg-brand-700 transition-all duration-300 flex items-center justify-center gap-3 group tracking-wide"
              >
                Mulai Menanam
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tentang-kami"
                className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-white text-slate-700 font-bold rounded-[20px] shadow-lg border border-slate-100 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-brand-600 fill-current" />
                </div>
                Lihat Cerita Kami
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-slate-100 pt-8 sm:pt-10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm relative">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">5k+ Penanam Puas</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Garansi Tumbuh</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative lg:mt-0 h-[500px] lg:h-[700px] w-full z-10"
          >
             <Image 
               src="/images/hero-3d.png" 
               alt="Modern Botanical Garden 3D Render" 
               fill
               className="object-contain drop-shadow-2xl"
               priority
             />

             {/* Floating Info Cards */}
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 right-0 sm:right-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 z-20 flex items-center gap-4 group"
             >
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-amber-500 fill-current" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Hot Promo</p>
                   <p className="text-sm font-black text-slate-900">Flash Sale 50%</p>
                </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-40 left-0 sm:left-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 z-20 flex items-center gap-4 group"
             >
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Pengiriman</p>
                   <p className="text-sm font-black text-slate-900">Bisa COD & Instan</p>
                </div>
             </motion.div>

            {/* Decorative Blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-200/30 blur-[100px] -z-10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-leaf-200/30 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
