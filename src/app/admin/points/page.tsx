'use client'
import { Coins, History, TrendingUp, Gift, Wallet } from 'lucide-react'

export default function PointsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Points & Loyalty</h1>
          <p className="text-slate-500 font-medium mt-1">Sistem reward poin belanja yang dapat ditukarkan dengan diskon atau produk.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
         <div className="p-10 bg-slate-900 text-white rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
               <Coins className="w-12 h-12 text-brand-400 mb-6" />
               <h3 className="text-2xl font-black mb-2 font-heading">Konfigurasi Nilai Poin</h3>
               <p className="text-brand-100 text-sm leading-relaxed mb-10">
                 Atur berapa nilai Rupiah untuk setiap 1 poin yang didapatkan pelanggan saat belanja.
               </p>
               <div className="flex items-center gap-4 text-3xl font-black">
                  <span>Rp 1.000</span>
                  <span className="text-brand-500">=</span>
                  <span className="text-brand-400">1 Poin</span>
               </div>
            </div>
            <button className="relative z-10 mt-12 w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Update Conversion Rate</button>
         </div>

         <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-black text-slate-900 font-heading tracking-tight">Katalog Penukaran</h3>
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Voucher Diskon Rp 5.000', cost: '50 Poin' },
                 { name: 'Voucher Diskon Rp 10.000', cost: '90 Poin' },
                 { name: 'Free Benih Cabai Rawit', cost: '150 Poin' },
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                     <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                     <span className="px-4 py-1.5 bg-white rounded-xl text-xs font-black text-amber-600 shadow-sm">{item.cost}</span>
                  </div>
               ))}
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Tambah Reward Baru</button>
         </div>
      </div>
    </div>
  )
}
