'use client'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  MessageCircle,
  Bell,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatRupiah } from '@/lib/utils'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: 45250000, trend: '+12.5%', isUp: true, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Active Orders', value: 128, trend: '+8.2%', isUp: true, icon: ShoppingBag, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'New Customers', value: 54, trend: '-2.4%', isUp: false, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Store Rating', value: 4.9, trend: '+0.1', isUp: true, icon: Star, color: 'text-amber-500 bg-amber-500/10' },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-heading">Marketing Command Center 🚀</h2>
          <p className="text-gray-500 dark:text-gray-400">Selamat pagi, Admin. Berikut ringkasan performa Benih Seribuan hari ini.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-bold shadow-sm">Export Report</button>
           <button className="px-6 py-3 bg-brand-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-700/20 btn-shimmer">Add New Product</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.label === 'Total Revenue' ? 'bg-brand-600 text-white' : stat.color)}>
                  <stat.icon className="w-7 h-7" />
               </div>
               <div className={cn(
                 "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black",
                 stat.isUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
               )}>
                 {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                 {stat.trend}
               </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {typeof stat.value === 'number' && stat.label.includes('Revenue') ? formatRupiah(stat.value) : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Orders Table */}
         <div className="lg:col-span-2 p-10 rounded-[48px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-gray-900 dark:text-white font-heading">Recent Orders</h3>
               <button className="text-sm font-bold text-brand-700">View All</button>
            </div>
            <div className="space-y-6">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5 last:border-0 group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-xs">
                          #{2340 + i}
                       </div>
                       <div>
                          <p className="font-bold text-gray-900 dark:text-white">Customer Name {i}</p>
                          <p className="text-xs text-gray-400">2 minutes ago</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(150000)}</p>
                       <span className="text-[10px] font-black uppercase text-amber-500">Processing</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Marketing Actions */}
         <div className="space-y-8">
            <div className="p-8 rounded-[40px] bg-brand-900 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center mb-6">
                     <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-black mb-2 font-heading">WA Blast Ready</h4>
                  <p className="text-sm text-brand-200 mb-8 leading-relaxed">
                    Terdapat 450 pelanggan dalam segmen &quot;Abandoned Cart&quot;. Kirim pengingat sekarang?
                  </p>
                  <button className="w-full py-4 bg-white text-brand-900 rounded-2xl font-black text-sm shadow-xl shadow-black/20">
                     Kirim WA Blast
                  </button>
               </div>
            </div>

            <div className="p-8 rounded-[40px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl">
               <h4 className="text-lg font-black text-gray-900 dark:text-white mb-6 font-heading flex items-center gap-2">
                  <Bot className="w-5 h-5 text-brand-600" />
                  AI Insights
               </h4>
               <ul className="space-y-4">
                  {[
                    'Produk "Cabai Rawit" mengalami kenaikan tren pencarian sebesar 40%.',
                    'Efektivitas voucher WELCOME10 meningkat di wilayah Jabodetabek.',
                    'Stok Paket 50 Bibit akan habis dalam 3 hari berdasarkan laju penjualan.'
                  ].map((insight, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                       {insight}
                    </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
