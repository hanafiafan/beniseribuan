'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { User, Mail, Lock, Phone, Chrome } from 'lucide-react'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  }

  return (
    <AuthShell
      title="Mulai Kebun Anda Sendiri!"
      subtitle="Bergabunglah dengan komunitas ribuan orang yang telah berhasil membangun kebun rumah mereka sendiri."
      image="/images/hero-bg.png"
    >
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-heading">Daftar Akun</h2>
        <p className="text-gray-500 dark:text-gray-400">Sudah punya akun? <Link href="/login" className="text-brand-700 font-bold hover:underline">Masuk sekarang</Link></p>
      </div>

      <div className="space-y-6">
        <button className="w-full py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3 font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
           <Chrome className="w-5 h-5 text-red-500" />
           Daftar dengan Google
        </button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atau Isi Formulir</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Nama Depan</label>
               <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="As'ad"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 outline-none transition-all text-sm"
                    required
                  />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Nama Belakang</label>
               <input 
                 type="text" 
                 placeholder="RUN"
                 className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 outline-none transition-all text-sm"
               />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Alamat Email</label>
            <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="email" 
                 placeholder="nama@email.com"
                 className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 outline-none transition-all text-sm"
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Nomor WhatsApp</label>
            <div className="relative">
               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="tel" 
                 placeholder="0812XXXXXXXX"
                 className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 outline-none transition-all text-sm"
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Kata Sandi</label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="password" 
                 placeholder="Minimal 8 karakter"
                 className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 outline-none transition-all text-sm"
                 required
               />
            </div>
          </div>

          <div className="py-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" required />
              <span className="text-xs text-gray-500 leading-relaxed">
                Saya menyetujui <Link href="/terms" className="text-brand-700 font-bold">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="text-brand-700 font-bold">Kebijakan Privasi</Link> Benih Seribuan.
              </span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-700/20 transition-all duration-300 btn-shimmer"
          >
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
