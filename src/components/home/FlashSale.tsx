'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, Clock } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [activeFlashSale, setActiveFlashSale] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/marketing/flash-sale')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setActiveFlashSale(data)
        }
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!activeFlashSale) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(activeFlashSale.endDate).getTime()
      const diff = end - now

      if (diff <= 0) {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [activeFlashSale])

  if (loading || !activeFlashSale) return null

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[48px] overflow-hidden relative border border-slate-100 shadow-2xl shadow-slate-200/50">
           {/* Subtle Background Decor */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

           <div className="relative p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
                 <div>
                    <div className="flex items-center gap-3 text-brand-600 font-black text-sm uppercase tracking-[0.3em] mb-4">
                       <Zap className="w-6 h-6 fill-current animate-pulse text-amber-500" />
                       Flash Sale Sekarang
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 font-heading leading-tight max-w-xl">
                       Dapatkan Benih Premium Dengan Harga <span className="text-brand-600 underline decoration-brand-200 underline-offset-8 italic">Miring!</span>
                    </h2>
                 </div>

                 <div className="flex flex-col items-center lg:items-end gap-4">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Berakhir Dalam:</p>
                    <div className="flex gap-4">
                       {[
                         { value: timeLeft.hours, label: 'JAM' },
                         { value: timeLeft.minutes, label: 'MENIT' },
                         { value: timeLeft.seconds, label: 'DETIK' }
                       ].map((t, i) => (
                         <div key={i} className="flex flex-col items-center">
                            <div className="w-20 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-900 shadow-sm">
                               {String(t.value).padStart(2, '0')}
                            </div>
                            <span className="mt-3 text-[10px] font-black text-slate-400 tracking-widest">{t.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {activeFlashSale.products?.map((item: any, i: number) => {
                    const progress = (item.soldCount / item.stock) * 100
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-slate-100 rounded-[40px] p-6 hover:shadow-xl hover:border-brand-100 transition-all group"
                      >
                         <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 border border-slate-50">
                            <Image src={item.product.images?.[0]?.url || '/images/placeholder.png'} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-amber-500 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg">
                               HEMAT {Math.round((1 - Number(item.flashPrice)/Number(item.product.price)) * 100)}%
                            </div>
                         </div>
                         
                         <h3 className="text-slate-900 font-bold text-sm line-clamp-2 mb-4 h-10 group-hover:text-brand-600 transition-colors font-heading">
                            {item.product.name}
                         </h3>

                         <div className="flex items-end gap-3 mb-6">
                            <span className="text-2xl font-black text-brand-600">{formatRupiah(item.flashPrice)}</span>
                            <span className="text-xs text-slate-300 line-through mb-1 font-bold">{formatRupiah(item.product.price)}</span>
                         </div>

                         <div className="space-y-2 mb-8">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                               <span>Terjual {item.soldCount}</span>
                               <span>Sisa {item.stock - item.soldCount}</span>
                            </div>
                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${progress}%` }}
                                 className="h-full bg-gradient-to-r from-brand-500 to-emerald-500" 
                               />
                            </div>
                         </div>

                         <Link 
                           href={`/produk/${item.product.slug}`}
                           className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20"
                         >
                            Ambil Sekarang
                            <ChevronRight className="w-4 h-4" />
                         </Link>
                      </motion.div>
                    )
                 })}
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}
