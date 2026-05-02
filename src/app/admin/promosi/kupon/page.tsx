'use client'

import { useState, useEffect } from 'react'
import { Ticket, Plus, Search, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react'
import { formatRupiah, cn } from '@/lib/utils'

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/vouchers')
      .then(res => res.json())
      .then(data => {
        setVouchers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Manajemen Voucher</h1>
          <p className="text-slate-500">Buat dan kelola kode promo untuk meningkatkan penjualan.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all">
          <Plus className="w-5 h-5" />
          Tambah Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading vouchers...</p>
        ) : vouchers.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
             <Ticket className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold">Belum ada voucher aktif.</p>
          </div>
        ) : (
          vouchers.map((v) => (
            <div key={v.id} className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    v.isActive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  )}>
                    {v.isActive ? 'Aktif' : 'Nonaktif'}
                  </div>
               </div>

               <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                  <Ticket className="w-7 h-7" />
               </div>

               <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{v.code}</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                 {v.type === 'percentage' ? `${v.value}% OFF` : v.type === 'fixed' ? `${formatRupiah(v.value)} OFF` : 'Gratis Ongkir'}
               </p>

               <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-400">Min. Belanja:</span>
                     <span className="font-bold text-slate-900">{formatRupiah(v.minPurchase || 0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-400">Penggunaan:</span>
                     <span className="font-bold text-slate-900">{v.usedCount} / {v.usageLimit || '∞'}</span>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-brand-50 hover:text-brand-600 transition-all">Edit</button>
                  <button className="p-3 bg-slate-50 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
