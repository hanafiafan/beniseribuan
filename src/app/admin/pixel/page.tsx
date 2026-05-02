'use client'
import { BarChart3, Activity, MousePointer2, Eye } from 'lucide-react'

export default function PixelPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Pixel & Analytics Monitor</h1>
          <p className="text-slate-500 font-medium">Pantau efektivitas iklan dan perilaku pengunjung secara real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-10">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
               <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                     <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Live</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Views</p>
               <p className="text-2xl font-black text-slate-900">4,520</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
               <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                     <MousePointer2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add to Cart</p>
               <p className="text-2xl font-black text-slate-900">128</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4 lg:col-span-2 relative overflow-hidden flex flex-col justify-end">
               <div className="absolute top-0 right-0 p-6">
                  <Activity className="w-12 h-12 text-brand-600/10" />
               </div>
               <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1">Conversion Rate</p>
               <div className="flex items-end gap-3">
                  <p className="text-4xl font-black text-slate-900">3.8%</p>
                  <span className="text-xs font-bold text-emerald-500 pb-1.5">+0.4% this week</span>
               </div>
            </div>
         </div>
      </div>

      <div className="p-12 bg-slate-900 text-white rounded-[48px] shadow-2xl text-center space-y-6">
         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-brand-400" />
         </div>
         <h3 className="text-2xl font-black font-heading">Meta & Google Pixel Integration</h3>
         <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
           Hubungkan Facebook Pixel, TikTok Pixel, dan Google Analytics GA4 Anda di sini. 
           Sistem akan secara otomatis mengirimkan event &quot;Purchase&quot; dan &quot;Add to Cart&quot; untuk mengoptimalkan algoritma iklan Anda.
         </p>
         <button className="px-10 py-4 bg-brand-600 text-white rounded-2xl font-black text-sm hover:bg-brand-700 transition-all">Configure Tracking</button>
      </div>
    </div>
  )
}
