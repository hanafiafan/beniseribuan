'use client'
import { ShieldCheck, AlertCircle, Lock, Eye, EyeOff, Key, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { 
  config: any; 
  setConfig: (c: any) => void 
  maintenanceMode: boolean
  setMaintenanceMode: (v: boolean) => void
}

export default function SecurityTab({ config, setConfig, maintenanceMode, setMaintenanceMode }: Props) {
  const set = (key: string, val: string) => setConfig({ ...config, [key]: val })

  const Toggle = ({ label, desc, value, onChange, color = 'brand' }: any) => (
    <div className={cn(
      "p-6 rounded-3xl border transition-all flex items-center justify-between",
      value ? `bg-${color}-50 border-${color}-100` : "bg-slate-50 border-slate-100"
    )}>
      <div>
        <p className="font-black text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className={cn(
        "w-14 h-7 rounded-full relative transition-all shrink-0",
        value ? `bg-${color}-500` : "bg-slate-200"
      )}>
        <div className={cn("absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all", value ? "left-7" : "left-0.5")} />
      </button>
    </div>
  )

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-black text-slate-900 font-heading">Keamanan & Akses Sistem</h3>
        <p className="text-slate-500 mt-1">Kontrol keamanan, autentikasi, dan akses platform.</p>
      </div>

      {/* System Toggles */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-4 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" /> Kontrol Sistem
        </h4>
        <Toggle label="Mode Perbaikan (Maintenance)" desc="Matikan akses publik ke storefront saat perbaikan besar" value={maintenanceMode} onChange={setMaintenanceMode} color="red" />
        <Toggle label="Registrasi User Baru" desc="Izinkan pengunjung mendaftar akun baru" value={config.allow_registration !== 'false'} onChange={(v: boolean) => set('allow_registration', String(v))} />
        <Toggle label="Login dengan Google (OAuth)" desc="Izinkan masuk menggunakan akun Google" value={config.allow_google_oauth !== 'false'} onChange={(v: boolean) => set('allow_google_oauth', String(v))} />
        <Toggle label="Two-Factor Authentication (2FA)" desc="Wajibkan verifikasi 2 langkah untuk admin" value={config.require_2fa === 'true'} onChange={(v: boolean) => set('require_2fa', String(v))} />
        <Toggle label="Mode Debug (Logging Error)" desc="Tampilkan error detail di konsol server" value={config.debug_mode === 'true'} onChange={(v: boolean) => set('debug_mode', String(v))} color="amber" />
      </div>

      {/* NextAuth Config */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-600" /> NextAuth Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEXTAUTH_SECRET</label>
            <div className="relative">
              <input type="password" value={config.nextauth_secret_preview || '•••••••••••••••••••••••••'} readOnly className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none font-bold shadow-sm font-mono text-sm text-slate-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Set via .env</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Client ID (OAuth)</label>
            <div className="relative">
              <input type="password" value={config.google_client_id_preview || '•••••••••••••••••••••••••'} readOnly className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none font-bold shadow-sm font-mono text-sm text-slate-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Set via .env</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700">⚠️ Secret keys yang bersifat kritis (NEXTAUTH_SECRET, database credentials) hanya dapat diubah melalui file <code className="font-mono bg-amber-100 px-1 rounded">.env</code> di server untuk keamanan maksimum.</p>
        </div>
      </div>

      {/* Rate Limiting & CORS */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500" /> Rate Limiting & Pembatasan Akses
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Login Attempt</label>
            <input type="number" value={config.max_login_attempts || '5'} onChange={e => set('max_login_attempts', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lockout Duration (menit)</label>
            <input type="number" value={config.lockout_duration || '30'} onChange={e => set('lockout_duration', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Max Age (jam)</label>
            <input type="number" value={config.session_max_age || '24'} onChange={e => set('session_max_age', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Whitelist IP Address Admin (pisahkan dengan koma)</label>
          <input value={config.admin_ip_whitelist || ''} onChange={e => set('admin_ip_whitelist', e.target.value)} placeholder="192.168.1.1, 103.xxx.xxx.xxx" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
        </div>
      </div>
    </div>
  )
}
