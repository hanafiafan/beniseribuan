'use client'
import { motion } from 'framer-motion'
import { Leaf, Users, ShieldCheck, Heart } from 'lucide-react'

export default function TentangKamiPage() {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-leaf-50 z-0" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Leaf className="w-4 h-4" />
            Cerita Kami
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-heading"
          >
            Menanam Harapan di <br />
            <span className="text-gradient-brand">Setiap Jengkal Tanah</span>
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-custom -mt-20 relative z-20">
        <div className="glass-panel rounded-[48px] p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 font-heading">Visi Benih Seribuan</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Benih Seribuan lahir dari sebuah mimpi sederhana: ingin melihat setiap rumah tangga di Indonesia memiliki kebun sendiri, meskipun hanya di lahan yang sempit. Kami percaya bahwa berkebun bukan hanya tentang hasil panen, tapi tentang kesehatan mental, kemandirian pangan, dan kebahagiaan sederhana.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Sejak 2020, kami telah membantu ribuan keluarga untuk mulai menanam. Dengan menyediakan benih berkualitas tinggi dengan harga yang sangat terjangkau, kami ingin memastikan bahwa siapapun bisa mulai berkebun tanpa hambatan biaya.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: '5.000+', desc: 'Komunitas Penanam' },
                { icon: ShieldCheck, label: 'Premium', desc: 'Kualitas Benih' },
                { icon: Heart, label: '100%', desc: 'Cinta Alam' },
                { icon: Leaf, label: 'Urban', desc: 'Farming Expert' },
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-brand-50 rounded-[32px] text-center hover:bg-brand-600 hover:text-white transition-all duration-500 group">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-brand-600 group-hover:text-white transition-colors" />
                  <h4 className="text-2xl font-black mb-1 font-heading">{stat.label}</h4>
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team/Values */}
      <section className="container-custom py-24">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-16 font-heading">Nilai yang Kami Pegang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Aksesibilitas', 
              desc: 'Semua orang berhak mendapatkan benih terbaik dengan harga yang jujur.' 
            },
            { 
              title: 'Kualitas Tanpa Kompromi', 
              desc: 'Setiap benih telah melalui uji daya kecambah untuk memastikan keberhasilan menanam Anda.' 
            },
            { 
              title: 'Edukasi Berkelanjutan', 
              desc: 'Kami tidak hanya menjual benih, kami mendampingi perjalanan berkebun Anda.' 
            }
          ].map((val, i) => (
            <div key={i} className="glass-panel rounded-[40px] p-10 hover:-translate-y-2 transition-all duration-500">
              <h4 className="text-xl font-bold text-slate-900 mb-4 font-heading">{val.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
