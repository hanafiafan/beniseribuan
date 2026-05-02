'use client'
import { Zap, Send, Mail, MessageSquare } from 'lucide-react'

export default function CampaignsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">WA & Email Blast</h1>
          <p className="text-slate-500 font-medium">Jangkau pelanggan Anda secara instan dan personal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
               <MessageSquare className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-900 mb-2">WhatsApp Marketing</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Kirim pengingat tagihan atau promo diskon langsung ke WhatsApp pelanggan.</p>
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20">Buat Campaign WA</button>
         </div>

         <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
               <Mail className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-lg font-black text-slate-900 mb-2">Email Newsletter</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Broadcast artikel blog terbaru atau update stok ke ribuan subscriber email.</p>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20">Buat Campaign Email</button>
         </div>

         <div className="p-8 bg-brand-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
               <Zap className="w-8 h-8 text-brand-400 mb-4" />
               <h3 className="text-lg font-black mb-2">Omnichannel Power</h3>
               <p className="text-xs text-brand-200 leading-relaxed">Gabungkan kekuatan WA dan Email untuk konversi penjualan maksimal.</p>
            </div>
            <div className="relative z-10 pt-6">
               <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest mb-4">Integrasi Fonnte & Mailchimp</p>
               <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-brand-500" />
               </div>
            </div>
         </div>
      </div>

      <div className="bg-slate-100 rounded-[48px] p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200">
         Campaign History & Logs akan muncul di sini.
      </div>
    </div>
  )
}
