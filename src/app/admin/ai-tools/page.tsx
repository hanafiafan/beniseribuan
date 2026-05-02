'use client'
import { Bot, Sparkles, Wand2, FileText, Layout } from 'lucide-react'

export default function AIToolsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">AI Copywriter & Tools</h1>
          <p className="text-slate-500 font-medium">Buat konten promosi dan deskripsi produk dalam hitungan detik dengan AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-8 group hover:border-brand-200 transition-all">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <FileText className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 mb-3 font-heading">Auto Product Description</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 Masukkan nama produk dan poin keunggulan, AI akan membuatkan deskripsi persuasif yang SEO-friendly secara otomatis.
               </p>
            </div>
            <button className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest hover:underline">
               Gunakan AI Copywriter <Sparkles className="w-3 h-3" />
            </button>
         </div>

         <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-8 group hover:border-blue-200 transition-all">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <Layout className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 mb-3 font-heading">Social Media Post Generator</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 Buat caption untuk Instagram, Facebook, dan TikTok lengkap dengan hashtag populer sesuai tren pertanian terkini.
               </p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">
               Generate Social Content <Wand2 className="w-3 h-3" />
            </button>
         </div>
      </div>

      <div className="p-12 bg-brand-600 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
         <div className="w-24 h-24 shrink-0 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
            <Bot className="w-12 h-12" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black mb-2 font-heading">Powered by Gemini AI</h3>
            <p className="text-brand-100 font-medium">Sistem kecerdasan buatan terintegrasi untuk membantu operasional pemasaran Benih Seribuan setiap hari.</p>
         </div>
         <button className="px-10 py-4 bg-white text-brand-700 rounded-2xl font-black text-sm shadow-xl shadow-black/20 hover:scale-105 transition-all">
            Hubungkan API Key
         </button>
      </div>
    </div>
  )
}
