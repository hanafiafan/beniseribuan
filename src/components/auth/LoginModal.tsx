'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  X, Mail, Lock, Eye, EyeOff, AlertCircle, 
  Loader2, ArrowRight, User, Phone, MapPin, ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useUIStore } from '@/lib/store/useUIStore'
import { cn } from '@/lib/utils'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export default function AuthModal() {
  const { isLoginModalOpen, closeLoginModal, authView } = useUIStore()
  const router = useRouter()
  
  const [view, setView] = useState<'login' | 'register'>(authView)
  const [step, setStep] = useState(1) // for register

  // Reset view when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setView(authView)
      setStep(1)
      setError('')
    }
  }, [isLoginModalOpen, authView])
  
  // Login States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Register States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    province: '',
    provinceId: '',
    city: '',
    cityId: '',
    district: '',
    postalCode: '',
    address: '',
  })
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    if (view === 'register' && step === 2 && provinces.length === 0) {
      fetchProvinces()
    }
  }, [view, step])

  const fetchProvinces = async () => {
    try {
      const res = await fetch('/api/shipping?type=provinces')
      const data = await res.json()
      if (Array.isArray(data)) setProvinces(data)
    } catch (e) { console.error(e) }
  }

  const fetchCities = async (provId: string) => {
    try {
      const res = await fetch(`/api/shipping?type=cities&provinceId=${provId}`)
      const data = await res.json()
      if (Array.isArray(data)) setCities(data)
    } catch (e) { console.error(e) }
  }

  if (!isLoginModalOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email atau password salah. Silakan coba lagi.')
      } else {
        closeLoginModal()
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })
        closeLoginModal()
        router.refresh()
      } else {
        setError(data.error || 'Gagal mendaftar. Silakan coba lagi.')
        setStep(1)
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/akun' })
    } catch (error) {
      setError('Gagal masuk dengan Google.')
      setIsGoogleLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-brand-600 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-400 rounded-full blur-3xl" />
             </div>
             <button 
               onClick={closeLoginModal}
               className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all z-20"
             >
                <X className="w-5 h-5" />
             </button>
             <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl font-black text-white font-heading tracking-tight">
                  {view === 'login' ? 'Selamat Datang!' : (step === 1 ? 'Mulai Kebun Anda!' : 'Lengkapi Profil')}
                </h2>
             </div>
             {view === 'register' && step === 2 && (
               <button 
                 onClick={() => setStep(1)}
                 className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all z-20"
               >
                  <ChevronLeft className="w-5 h-5" />
               </button>
             )}
          </div>

          <div className="p-10 space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {view === 'login' ? (
              <>
                <div className="space-y-4">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full py-4 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                      <GoogleIcon />
                      {isGoogleLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
                  </button>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atau gunakan email</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                          type="email" 
                          placeholder="nama@email.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold text-slate-900"
                          required
                        />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <div className="flex justify-between px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                        <Link href="/forgot-password" className="text-[10px] font-bold text-brand-700 hover:underline px-1">Lupa password?</Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold text-slate-900"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-3 group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Masuk Sekarang
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Belum punya akun? <button onClick={() => setView('register')} className="text-brand-700 font-black hover:underline ml-1">Daftar Gratis</button>
                  </p>
                </div>
              </>
            ) : (
              // REGISTER VIEW
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tahap {step} dari 2</p>
                   <div className="flex gap-1.5">
                      <div className={cn("w-8 h-1.5 rounded-full transition-all", step >= 1 ? "bg-brand-500" : "bg-slate-100")} />
                      <div className={cn("w-8 h-1.5 rounded-full transition-all", step >= 2 ? "bg-brand-500" : "bg-slate-100")} />
                   </div>
                </div>

                {step === 1 ? (
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Depan</label>
                         <input placeholder="Budi" className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Belakang</label>
                         <input placeholder="Santoso" className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                      <input type="email" placeholder="nama@email.com" className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">No. WhatsApp</label>
                      <input type="tel" placeholder="0812..." className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>

                    <div className="space-y-2 pb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kata Sandi</label>
                      <input type="password" placeholder="Min. 8 karakter" className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} />
                    </div>

                    <button type="submit" className="w-full py-5 bg-brand-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3">
                      Lanjut ke Alamat <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-sm text-slate-500 font-medium">
                      Sudah punya akun? <button type="button" onClick={() => setView('login')} className="text-brand-700 font-black hover:underline ml-1">Masuk Sekarang</button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Provinsi</label>
                         <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-xs outline-none"
                            onChange={e => {
                              const p = provinces.find(x => x.province_id === e.target.value)
                              setFormData({...formData, provinceId: e.target.value, province: p.province})
                              fetchCities(e.target.value)
                            }}
                            required
                          >
                             <option value="">Pilih</option>
                             {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kota/Kab</label>
                         <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-xs outline-none"
                            onChange={e => {
                              const c = cities.find(x => x.city_id === e.target.value)
                              setFormData({...formData, cityId: e.target.value, city: c.city_name, postalCode: c.postal_code})
                            }}
                            required
                          >
                             <option value="">Pilih</option>
                             {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kecamatan</label>
                      <input placeholder="Contoh: Jebres" className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Lengkap</label>
                      <textarea placeholder="Nama jalan, No Rumah, RT/RW..." className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-sm outline-none h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                    </div>

                    <button disabled={isLoading} type="submit" className="w-full py-5 bg-brand-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3">
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Selesaikan Pendaftaran'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
