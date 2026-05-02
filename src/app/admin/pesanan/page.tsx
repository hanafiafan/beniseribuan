'use client'
import { useState, useEffect } from 'react'
import { ShoppingCart, Clock, CheckCircle, XCircle, Search, Eye, MoreVertical, Loader2 } from 'lucide-react'
import { formatRupiah, cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusMap: any = {
    'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
    'processing': { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
    'shipped': { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-700', icon: ShoppingCart },
    'completed': { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle },
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading mb-2">Manajemen Pesanan</h1>
          <p className="text-slate-500">Kelola dan pantau semua pesanan masuk dari pelanggan.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari Order ID atau Pelanggan..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Filter</button>
              <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Export CSV</button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">Memuat data pesanan...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <ShoppingCart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">Tidak ada pesanan ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusMap[order.status] || statusMap.pending
                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-6">
                        <span className="font-black text-slate-900 text-sm">#{order.orderNumber}</span>
                      </td>
                      <td className="p-6">
                         <div>
                            <p className="font-bold text-slate-900 text-sm">{order.user?.displayName || 'Guest'}</p>
                            <p className="text-xs text-slate-400">{order.user?.email || '-'}</p>
                         </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-medium text-slate-500">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-slate-900 text-sm">{formatRupiah(order.total)}</span>
                      </td>
                      <td className="p-6">
                         <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide", status.color)}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                         </div>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                               <Eye className="w-4 h-4" />
                            </button>
                            <select 
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="text-[10px] font-bold bg-slate-100 border-none rounded-lg focus:ring-0 outline-none cursor-pointer"
                            >
                               {Object.keys(statusMap).map(s => (
                                 <option key={s} value={s}>{statusMap[s].label}</option>
                               ))}
                            </select>
                         </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
