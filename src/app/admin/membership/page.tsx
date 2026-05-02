'use client'
import { Crown, Star, ShieldCheck, Users, TrendingUp, Gift } from 'lucide-react'

export default function MembershipPage() {
  const tiers = [
    { name: 'Seedling (Basic)', color: 'text-slate-400', bg: 'bg-slate-50', icon: Star, members: 840 },
    { name: 'Sprout (Silver)', color: 'text-blue-500', bg: 'bg-blue-50', icon: Star, members: 320 },
    { name: 'Bloom (Gold)', color: 'text-amber-500', bg: 'bg-amber-50', icon: Star, members: 120 },
    { name: 'Master Gardener (Platinum)', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Crown, members: 45 },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Membership Program</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola sistem tingkatan member dan benefit loyalitas.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-brand-900 text-white rounded-2xl font-black shadow-xl shadow-black/20 hover:bg-black transition-all">
          <Gift className="w-5 h-5" />
          Atur Benefit Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
         {tiers.map((tier, i) => (
            <div key={i} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6 group hover:shadow-xl transition-all">
               <div className={`w-14 h-14 ${tier.bg} ${tier.color} rounded-2xl flex items-center justify-center`}>
                  <tier.icon className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900">{tier.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">{tier.members} Members</p>
               </div>
               <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Benefit</p>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> Free Ongkir s/d 5k
                     </li>
                     <li className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> Cashback 2%
                     </li>
                  </ul>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-12 mx-6 text-center space-y-4">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <Users className="w-10 h-10" />
         </div>
         <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Segmentasi Member Otomatis</h2>
         <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
           Sistem akan secara otomatis menaikkan tier member berdasarkan total belanja tahunan mereka. 
           Berikan pengalaman belanja eksklusif bagi pelanggan setia Anda.
         </p>
      </div>
    </div>
  )
}
