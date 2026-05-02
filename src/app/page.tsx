'use client'
import { HeroSection } from '@/components/home/HeroSection'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import FlashSale from '@/components/home/FlashSale'
import { Users, Sprout, Map, Award, ShoppingBag, CreditCard, Truck, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Counter from '@/components/common/Counter'

export default function Home() {
  return (
    <div className="flex flex-col pb-24">
      <HeroSection />

      <FlashSale />
      
      <div className="mt-24">
        <CategorySection />
      </div>

      <div className="mt-24">
        <FeaturedProducts />
      </div>

      {/* Stats Counter Section */}
      <section className="container-custom py-24">
        <div className="bg-slate-50 rounded-[64px] p-12 md:p-20 relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 blur-[80px] rounded-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {[
              { icon: Users, value: 5601, label: 'Pelanggan Senang', suffix: '+' },
              { icon: Sprout, value: 35000, label: 'Benih Terjual', suffix: '+' },
              { icon: Award, value: 140, label: 'Variasi Benih', suffix: '+' },
              { icon: Map, value: 34, label: 'Provinsi Terjangkau' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl sm:rounded-3xl bg-white flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2 font-heading">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Shopping Flow */}
      <section className="container-custom py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 font-heading tracking-tight">
            Belanja Aman & <span className="text-brand-600">Nyaman</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Proses belanja yang transparan dan aman untuk menjamin kepuasan Anda berkebun dari rumah.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { step: '01', icon: ShoppingBag, title: 'Pilih Benih', desc: 'Pilih dari ratusan varian benih unggulan dengan daya tumbuh tinggi.' },
            { step: '02', icon: CreditCard, title: 'Bayar Mudah', desc: 'Berbagai pilihan pembayaran instan, otomatis, dan terverifikasi.' },
            { step: '03', icon: Truck, title: 'Terima Paket', desc: 'Pengiriman cepat dengan proteksi khusus agar benih tetap segar.' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative p-10 bg-white border border-slate-100 rounded-[48px] group hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
            >
              <span className="absolute top-8 right-10 text-5xl sm:text-6xl font-black text-slate-50 group-hover:text-brand-50 transition-colors">
                {item.step}
              </span>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 font-heading">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-24">
        <div className="bg-brand-600 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-brand-500/30">
          {/* Abstract Shapes */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[80%] bg-white/10 blur-[80px] rounded-full rotate-45" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[80%] bg-brand-400/30 blur-[80px] rounded-full -rotate-45" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-8">
              <Leaf className="w-4 h-4" />
              Gabung Bersama 5k+ Penanam
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-10 font-heading leading-tight">
              Siap Memulai Kebun <br /> Impian Anda?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link 
                href="/toko" 
                className="w-full sm:w-auto px-12 py-5 bg-white text-brand-700 font-black rounded-2xl shadow-2xl shadow-black/20 hover:scale-105 transition-all duration-300"
              >
                Belanja Sekarang
              </Link>
              <Link 
                href="/masuk" 
                className="w-full sm:w-auto px-12 py-5 bg-brand-700 text-white font-black rounded-2xl border border-brand-500/50 hover:bg-brand-800 transition-all duration-300"
              >
                Daftar Akun
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
