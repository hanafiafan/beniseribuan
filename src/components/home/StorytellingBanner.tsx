'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Leaf, Sprout, TrendingUp } from 'lucide-react'

export function StorytellingBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="relative overflow-hidden rounded-[48px] bg-brand-900 text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leaf-400 rounded-full blur-[100px] -ml-24 -mb-24" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          {/* Content */}
          <div className="p-8 lg:p-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold mb-6 border border-white/5">
                <Leaf className="w-3 h-3" />
                <span>MISI KAMI</span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight font-heading">
                Lebih Dari Sekedar <span className="text-brand-400">Toko Benih</span>
              </h2>
              
              <p className="text-lg text-brand-100/80 mb-10 leading-relaxed">
                Kami percaya setiap jengkal tanah di rumah Anda memiliki potensi untuk menghasilkan pangan sehat bagi keluarga. Benih Seribuan hadir untuk mempermudah transisi Anda menuju gaya hidup mandiri pangan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Sprout, title: 'Kualitas Teruji', desc: 'Daya tumbuh unggul 95%' },
                  { icon: CheckCircle2, title: 'Bimbingan Gratis', desc: 'Konsultasi via WhatsApp' },
                  { icon: TrendingUp, title: 'Hasil Berlimpah', desc: 'Varian benih pilihan' },
                  { icon: Leaf, title: 'Ramah Lingkungan', desc: 'Kemasan eco-friendly' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-brand-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-brand-200/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                href="/tentang-kami" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-900 rounded-2xl font-bold hover:bg-brand-50 transition-all duration-300 shadow-xl shadow-black/20"
              >
                Pelajari Filosofi Kami
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] lg:h-auto min-h-[500px]">
             <Image 
               src="/images/hero-bg.png" 
               alt="Community Gardening" 
               fill 
               className="object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent to-brand-900" />
             
             {/* Float Card */}
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute top-1/2 left-1/2 lg:left-0 -translate-x-1/2 lg:-translate-x-1/4 -translate-y-1/2 p-6 rounded-3xl card-glass border border-white/20 shadow-2xl backdrop-blur-xl text-white max-w-[280px]"
             >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-2xl">
                    🌱
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">35.000+</h4>
                    <p className="text-xs text-white/60 uppercase tracking-widest font-bold">Benih Terjual</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  &quot;Alhamdulillah, paket benihnya lengkap dan cara menanamnya sangat mudah diikuti untuk pemula seperti saya.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-400" />
                   <div>
                     <p className="text-xs font-bold">Siti Aminah</p>
                     <p className="text-[10px] text-white/40">Ibu Rumah Tangga</p>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
