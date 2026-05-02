'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-brand-50 rounded-[32px] flex items-center justify-center mb-8 animate-bounce-soft">
        <Leaf className="w-12 h-12 text-brand-600" />
      </div>
      
      <h1 className="text-8xl font-black text-slate-900 font-heading tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Halaman tidak ditemukan</h2>
      <p className="text-slate-500 max-w-md mb-12 font-medium">
        Sepertinya halaman yang Anda cari tidak ada atau telah dipindahkan ke lahan baru.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-full sm:w-auto px-8 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        <Link 
          href="/"
          className="w-full sm:w-auto px-10 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 flex items-center justify-center gap-3 transition-all"
        >
          <Home className="w-5 h-5" />
          Beranda
        </Link>
      </div>
    </div>
  )
}
