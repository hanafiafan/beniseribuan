'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { Eye, EyeOff, Lock, Mail, Chrome } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Auth logic here
  }

  return (
    <AuthShell
      title="Selamat Datang Kembali!"
      subtitle="Masuk ke akun Anda untuk melihat pesanan terbaru dan benih favorit Anda."
      image="/images/hero-product.png"
    >
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-heading">Masuk</h2>
        <p className="text-gray-500 dark:text-gray-400">Belum punya akun? <Link href="/register" className="text-brand-700 font-bold hover:underline">Daftar sekarang</Link></p>
      </div>

      <div className="space-y-6">
        <button className="w-full py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3 font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
           <Chrome className="w-5 h-5 text-red-500" />
           Masuk dengan Google
        </button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atau dengan Email</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Alamat Email</label>
            <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="email" 
                 placeholder="nama@email.com"
                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 dark:focus:border-brand-600 outline-none transition-all text-gray-900 dark:text-white"
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Kata Sandi</label>
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-brand-700 hover:underline">Lupa password?</Link>
            </div>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type={showPassword ? 'text' : 'password'} 
                 placeholder="••••••••"
                 className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-brand-500 dark:focus:border-brand-600 outline-none transition-all text-gray-900 dark:text-white"
                 required
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-700 transition-colors"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <label htmlFor="remember" className="text-xs text-gray-500 font-medium">Ingat saya di perangkat ini</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-700/20 transition-all duration-300 btn-shimmer flex items-center justify-center gap-2"
          >
            {isLoading ? 'Sedang Masuk...' : 'Masuk ke Akun'}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
