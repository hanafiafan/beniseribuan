'use client'
import { ShoppingBag, Package, Star, CreditCard, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

export default function AccountDashboard() {
  const stats = [
    { label: 'Total Pesanan', value: '12', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Belum Dibayar', value: '1', icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
    { label: 'Dalam Proses', value: '2', icon: Package, color: 'text-brand-600 bg-brand-50' },
    { label: 'Ulasan Produk', value: '8', icon: Star, color: 'text-purple-600 bg-purple-50' },
  ]

  const recentOrders = [
    { id: 'BSB-231101-92A', date: '16 April 2024', total: 135000, status: 'Menunggu Pembayaran', statusColor: 'text-amber-600 bg-amber-50' },
    { id: 'BSB-231025-14B', date: '25 Maret 2024', total: 250000, status: 'Selesai', statusColor: 'text-green-600 bg-green-50' },
  ]

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-heading">Halo, As'ad! 👋</h2>
        <p className="text-gray-500 dark:text-gray-400">Dari dashboard ini Anda dapat melihat riwayat pesanan, mengelola alamat, dan mengatur profil Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
               <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-gray-900 dark:text-white font-heading">Pesanan Terbaru</h3>
          <Link href="/akun/pesanan" className="text-sm font-bold text-brand-700 flex items-center gap-1 hover:underline">
             Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700">
                    <th className="pb-4">Nomor Pesanan</th>
                    <th className="pb-4">Tanggal</th>
                    <th className="pb-4">Total</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                 {recentOrders.map((order) => (
                   <tr key={order.id} className="text-sm group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-6 font-bold text-gray-900 dark:text-white">#{order.id}</td>
                      <td className="py-6 text-gray-500">{order.date}</td>
                      <td className="py-6 font-bold text-brand-700 dark:text-brand-400">{formatRupiah(order.total)}</td>
                      <td className="py-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.statusColor}`}>
                            {order.status}
                         </span>
                      </td>
                      <td className="py-6">
                         <Link href={`/akun/pesanan/${order.id}`} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold hover:bg-brand-700 hover:text-white transition-all shadow-sm">
                            Detail
                         </Link>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-8 rounded-[32px] bg-brand-700 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <ShoppingBag className="w-64 h-64 -mr-16 -mt-16" />
         </div>
         <div className="relative z-10 flex-1">
            <h4 className="text-2xl font-black mb-2 font-heading">Bantu Kami Berkembang! 🌿</h4>
            <p className="text-brand-100 mb-6 text-sm">Ulas produk yang telah Anda beli dan dapatkan voucher diskon spesial untuk pembelian berikutnya.</p>
            <button className="px-8 py-3 bg-white text-brand-700 rounded-2xl font-bold text-sm shadow-xl shadow-black/20 hover:scale-105 transition-transform">
               Ulas Sekarang
            </button>
         </div>
         <div className="relative z-10 hidden md:block">
            <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-5xl">
               🎁
            </div>
         </div>
      </div>
    </div>
  )
}
