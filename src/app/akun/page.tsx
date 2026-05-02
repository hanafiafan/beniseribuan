'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  User, Package, Heart, MapPin, Settings, LogOut, 
  ChevronRight, ShoppingBag, Clock, ShieldCheck 
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AkunPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    points: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/masuk')
      return
    }

    if (status === 'authenticated') {
      // Fetch points
      fetch('/api/users/points')
        .then(res => res.json())
        .then(data => setStats(s => ({ ...s, points: data.points })))
      
      // We can also fetch actual order & wishlist counts here later
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">Halo, {user?.name || "Pekebun"}! 👋</h2>
          <p className="text-slate-500 font-medium">Selamat datang kembali! Berikut ringkasan aktivitas akun Anda.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-2xl border border-brand-100">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Akun Terverifikasi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pesanan Aktif', value: stats.orders, icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100' },
          { label: 'Total Wishlist', value: stats.wishlist, icon: Heart, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Poin Loyalitas', value: stats.points, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-8 rounded-[32px] border transition-all hover:shadow-xl hover:shadow-black/5", stat.bg, stat.border)}>
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm", stat.color)}>
                <stat.icon className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-3xl font-black text-slate-900 font-heading">{(stat.value ?? 0).toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-brand-600 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500" />
         <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
            <Package className="w-10 h-10 text-slate-200" />
         </div>
         <h3 className="text-xl font-black text-slate-900 mb-2 font-heading">Belum ada pesanan</h3>
         <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto mb-10 leading-relaxed">
            Sepertinya Anda belum melakukan pembelian apapun. Mari mulai menanam hari ini!
         </p>
         <button 
           onClick={() => router.push('/toko')}
           className="px-10 py-5 bg-brand-600 text-white font-black rounded-2xl shadow-2xl shadow-brand-500/20 hover:scale-105 hover:bg-brand-700 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
         >
           Mulai Belanja Sekarang
           <ChevronRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
