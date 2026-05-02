'use client'

import { useCompareStore } from '@/stores/compareStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, GitCompare, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CompareBar() {
  const { items, removeItem, clear } = useCompareStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || items.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[95%] max-w-3xl"
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
             <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                <GitCompare className="w-5 h-5 text-white" />
             </div>
             <div className="flex items-center gap-2">
                {items.map((item) => (
                  <div key={item.id} className="relative group shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-white/10 overflow-hidden relative">
                       <Image src={item.images?.[0]?.url || '/images/placeholder.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {items.length < 4 && (
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/20">
                     <span className="text-xs font-black">+</span>
                  </div>
                )}
             </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <button 
               onClick={clear}
               className="p-3 text-white/50 hover:text-red-400 transition-colors"
               title="Bersihkan Semua"
             >
                <Trash2 className="w-5 h-5" />
             </button>
             <Link 
               href="/bandingkan"
               className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 whitespace-nowrap"
             >
                Bandingkan ({items.length})
                <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
