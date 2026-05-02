'use client'
import { useState, useEffect } from 'react'
import { Zap, Plus, Clock, Calendar, Trash2, Edit, ShoppingBag, Search, Loader2, ArrowUpRight } from 'lucide-react'
import { formatRupiah, cn } from '@/lib/utils'
import Link from 'next/link'

export default function AdminFlashSalePage() {
  const [flashSales, setFlashSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchSales = () => {
    setLoading(true)
    fetch('/api/admin/flash-sale')
      .then(res => res.json())
      .then(data => {
        setFlashSales(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus event flash sale ini?')) return
    try {
      const res = await fetch(`/api/admin/flash-sale/${id}`, { method: 'DELETE' })
      if (res.ok) fetchSales()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredSales = flashSales.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pb-24 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">Flash Sale Manager</h1>
           <p className="text-sm text-slate-500 font-medium mt-1">Kelola dan jadwalkan event diskon kilat toko Anda.</p>
        </div>
        <Link 
          href="/admin/promosi/flash-sale/tambah"
          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-600/10 hover:bg-brand-700 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: 'Total Campaigns', value: flashSales.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Active Now', value: flashSales.filter(s => s.isActive).length, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Promo Items', value: flashSales.reduce((acc, s) => acc + (s.products?.length || 0), 0), icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h4 className="text-2xl font-black text-slate-900 font-heading">{stat.value}</h4>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                 <stat.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      {/* Main Filter & List Section */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Campaign Schedule</h3>
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search campaign name..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full sm:w-64 pl-11 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium" 
               />
            </div>
         </div>

         <div className="p-4 sm:p-6 space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                 <Loader2 className="w-10 h-10 animate-spin" />
                 <p className="text-xs font-black uppercase tracking-widest">Loading Campaigns...</p>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                 <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p className="font-bold text-sm">No campaigns found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                 {filteredSales.map((sale) => (
                   <div key={sale.id} className="bg-slate-50/50 border border-slate-100 rounded-[32px] overflow-hidden group hover:bg-white hover:border-brand-100 hover:shadow-xl transition-all duration-300">
                      <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                         <div className="flex items-start sm:items-center gap-6 flex-1">
                            <div className={cn(
                              "w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                              sale.isActive ? "bg-amber-500 text-slate-950 shadow-amber-500/20" : "bg-slate-200 text-slate-400 shadow-slate-200"
                            )}>
                               <Zap className="w-8 h-8 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                               <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <h4 className="text-xl font-black text-slate-900 font-heading truncate">{sale.name}</h4>
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    sale.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                                  )}>
                                     {sale.isActive ? 'Active' : 'Finished'}
                                  </span>
                               </div>
                               <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold">
                                  <div className="flex items-center gap-2">
                                     <Calendar className="w-3.5 h-3.5 text-brand-600" />
                                     {new Date(sale.startDate).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-3.5 h-3.5 text-brand-600" />
                                     {new Date(sale.startDate).toLocaleTimeString()} - {new Date(sale.endDate).toLocaleTimeString()}
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-3">
                            <Link 
                              href={`/admin/promosi/flash-sale/${sale.id}`}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black border border-slate-200 hover:bg-slate-50 transition-all text-xs"
                            >
                               <Edit className="w-4 h-4" />
                               Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(sale.id)}
                              className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                      </div>

                      {/* Expanded Section for Products */}
                      <div className="px-6 sm:px-8 pb-8">
                         <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100/50">
                            <div className="flex items-center justify-between mb-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participating Items ({sale.products?.length})</p>
                            </div>
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                               {sale.products?.map((item: any) => (
                                 <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                       <img src={item.product.images?.[0]?.url || '/images/placeholder.png'} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                       <p className="text-[10px] font-bold text-slate-900 truncate mb-0.5">{item.product.name}</p>
                                       <p className="text-[10px] font-black text-brand-600 leading-none">{formatRupiah(Number(item.flashPrice))}</p>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  )
}
