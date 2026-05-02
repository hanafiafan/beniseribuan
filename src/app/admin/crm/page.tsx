'use client'
import { TrendingUp, Users, Target, UserPlus } from 'lucide-react'

export default function CRMPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">CRM & Segmentasi Pelanggan</h1>
          <p className="text-slate-500 font-medium">Kelola database pelanggan dan target pasar Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
               <Users className="w-7 h-7" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Pelanggan</p>
               <p className="text-2xl font-black text-slate-900">1,240</p>
            </div>
         </div>
         <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
               <Target className="w-7 h-7" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Segmen Aktif</p>
               <p className="text-2xl font-black text-slate-900">12</p>
            </div>
         </div>
         <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
               <UserPlus className="w-7 h-7" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pertumbuhan</p>
               <p className="text-2xl font-black text-slate-900">+15%</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-12 text-center space-y-4">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <TrendingUp className="w-10 h-10" />
         </div>
         <h2 className="text-2xl font-black text-slate-900 font-heading">Sistem CRM Sedang Disiapkan</h2>
         <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
           Fitur ini memungkinkan Anda untuk melihat perilaku belanja pelanggan secara mendalam dan membagi mereka ke dalam segmen otomatis (seperti &quot;Loyal Customer&quot; atau &quot;Abandoned Cart&quot;).
         </p>
      </div>
    </div>
  )
}
