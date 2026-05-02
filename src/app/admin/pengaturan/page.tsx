'use client'
import { useState, useEffect } from 'react'
import { 
  Save, Palette, Globe, Shield, Bell, CheckCircle2, AlertCircle, 
  Store, Share2, Truck, CreditCard, Mail, Phone, MapPin, 
  MessageCircle, MoreHorizontal, Zap, Key, Link2, Play, RefreshCw, Activity,
  Search, Upload, BarChart, Image as ImageIcon, Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'umum', label: 'Umum', icon: Globe },
  { id: 'toko', label: 'Info Toko', icon: Store },
  { id: 'sosial', label: 'Media Sosial', icon: Share2 },
  { id: 'transaksi', label: 'Transaksi', icon: Truck },
  { id: 'integrasi', label: 'Integrasi API', icon: Zap },
  { id: 'keamanan', label: 'Keamanan', icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('umum')
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<any>({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data)
        setLoading(false)
      })
  }, [])

  const handleUpdate = async (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveGroup = async (keys: string[]) => {
    setSaving(true)
    try {
      for (const key of keys) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: settings[key] })
        })
      }
      setMessage({ type: 'success', text: 'Konfigurasi berhasil diperbarui!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan konfigurasi.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const checkConnection = async (provider: string, relevantKeys: string[]) => {
    setChecking(provider)
    try {
      const keysPayload: any = {}
      relevantKeys.forEach(k => { keysPayload[k] = settings[k] })

      const res = await fetch('/api/admin/settings/check-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, keys: keysPayload })
      })
      const data = await res.json()
      setConnectionStatus((prev: any) => ({
        ...prev,
        [provider]: { success: data.success, message: data.message }
      }))
    } catch (err) {
      setConnectionStatus((prev: any) => ({
        ...prev,
        [provider]: { success: false, message: "Error" }
      }))
    } finally {
      setChecking(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
    </div>
  )

  const SettingRow = ({ 
    label, description, icon: Icon, valueKey, type = "text", placeholder = "", 
    layout = "row", inputWidth = "sm:w-72" 
  }: any) => (
    <div className={cn(
      "p-4 bg-slate-50/40 rounded-2xl border border-slate-100 flex group hover:bg-white transition-all duration-300 gap-4",
      layout === 'col' ? "flex-col" : "flex-col sm:flex-row sm:items-center justify-between"
    )}>
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-100 transition-colors shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            {label}
            <span className="text-[9px] text-slate-300 font-mono hidden md:inline">[{valueKey}]</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight truncate sm:whitespace-normal">{description}</p>
        </div>
      </div>
      <div className={cn("shrink-0", layout === 'col' ? "w-full mt-2" : `w-full ${inputWidth}`)}>
        {type === "toggle" ? (
          <div className="flex items-center justify-end h-full">
            <button
              onClick={() => handleUpdate(valueKey, settings[valueKey] === 'true' ? 'false' : 'true')}
              disabled={saving}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300",
                settings[valueKey] === 'true' ? 'bg-brand-600' : 'bg-slate-200'
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                settings[valueKey] === 'true' ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        ) : type === "textarea" ? (
          <textarea 
            value={settings[valueKey] || ''}
            onChange={(e) => setSettings({...settings, [valueKey]: e.target.value})}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none font-medium transition-all resize-y"
          />
        ) : (
           <input 
             type={type}
             value={settings[valueKey] || ''}
             onChange={(e) => setSettings({...settings, [valueKey]: e.target.value})}
             placeholder={placeholder}
             className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none font-medium transition-all"
           />
        )}
      </div>
    </div>
  )

  const SectionHeader = ({ title, provider, relevantKeys, icon: Icon, colorClass }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg shadow-sm", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {connectionStatus[provider] && (
           <span className={cn("text-[10px] font-black px-3 py-1 rounded-full", connectionStatus[provider].success ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100")}>
              {connectionStatus[provider].message}
           </span>
        )}
        <button 
          onClick={() => checkConnection(provider, relevantKeys)}
          disabled={checking === provider}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-500 text-slate-600 hover:text-brand-600 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold shadow-sm"
        >
          {checking === provider ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
          CEK API
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 max-w-full">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">Pengaturan Sistem</h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Kelola seluruh konfigurasi global Benih Seribuan.</p>
      </div>

      <div className="px-4 sm:px-0 sticky top-[72px] z-[40]">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all whitespace-nowrap shrink-0",
                activeTab === tab.id ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-0">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm min-h-[400px]"
        >
          {activeTab === 'umum' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Identitas Situs</h2>
                <button onClick={() => handleSaveGroup(['site_name', 'site_tagline', 'currency'])} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              <SettingRow label="Nama Website" description="Nama utama toko Anda." icon={Globe} valueKey="site_name" inputWidth="sm:w-80" />
              <SettingRow label="Tagline" description="Slogan pendek di beranda." icon={Palette} valueKey="site_tagline" inputWidth="sm:w-96" />
              <SettingRow label="Mata Uang" description="Simbol transaksi (IDR)." icon={CreditCard} valueKey="currency" inputWidth="sm:w-32" />
              <SettingRow label="Dark Mode Switcher" description="Tampilkan toggle tema di Navbar." icon={Activity} valueKey="theme_switcher_enabled" type="toggle" />
            </div>
          )}

          {activeTab === 'toko' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Detail Perusahaan</h2>
                <button onClick={() => handleSaveGroup(['company_name', 'company_address', 'company_phone', 'company_email'])} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              <SettingRow label="Nama Legal" description="Nama resmi PT/CV." icon={Store} valueKey="company_name" inputWidth="sm:w-96" />
              <SettingRow label="Alamat Pusat" description="Lokasi fisik gudang/kantor." icon={MapPin} valueKey="company_address" type="textarea" layout="col" />
              <SettingRow label="Telepon" description="Nomor kontak resmi." icon={Phone} valueKey="company_phone" inputWidth="sm:w-64" />
              <SettingRow label="Email CS" description="Alamat email layanan." icon={Mail} valueKey="company_email" inputWidth="sm:w-80" type="email" />
            </div>
          )}

          {activeTab === 'sosial' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Media Sosial</h2>
              <SettingRow label="Facebook" description="Link URL Facebook." icon={Share2} valueKey="social_facebook" inputWidth="sm:w-96" />
              <SettingRow label="Instagram" description="Link URL Instagram." icon={Share2} valueKey="social_instagram" inputWidth="sm:w-96" />
              <SettingRow label="TikTok" description="Link URL TikTok." icon={Share2} valueKey="social_tiktok" inputWidth="sm:w-96" />
              <SettingRow label="WhatsApp API" description="Link wa.me resmi." icon={MessageCircle} valueKey="social_whatsapp" inputWidth="sm:w-96" />
            </div>
          )}

          {activeTab === 'transaksi' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Aturan Belanja</h2>
              <SettingRow label="Gratis Ongkir Min." description="Minimal belanja (Rp)." icon={Truck} valueKey="free_shipping_min" type="number" inputWidth="sm:w-48" />
            </div>
          )}

          {activeTab === 'integrasi' && (
            <div className="space-y-12">
               {/* Group: Payment & Shipping */}
               <div className="grid grid-cols-1 gap-12">
                  <div className="space-y-4">
                     <SectionHeader title="Payment (Xendit)" provider="xendit" relevantKeys={['XENDIT_SECRET_KEY']} icon={CreditCard} colorClass="bg-blue-50 text-blue-600" />
                     <SettingRow label="Secret Key" description="Xendit private API key." icon={Key} valueKey="XENDIT_SECRET_KEY" type="password" inputWidth="sm:w-full" layout="col" />
                  </div>
                  <div className="space-y-4">
                     <SectionHeader title="Shipping (RajaOngkir)" provider="rajaongkir" relevantKeys={['RAJAONGKIR_API_KEY', 'RAJAONGKIR_TYPE']} icon={Truck} colorClass="bg-orange-50 text-orange-600" />
                     <SettingRow label="API Key" icon={Key} valueKey="RAJAONGKIR_API_KEY" inputWidth="sm:w-full" layout="col" />
                     <SettingRow label="Tipe Akun" description="pro / basic / starter" icon={Link2} valueKey="RAJAONGKIR_TYPE" placeholder="pro" inputWidth="sm:w-48" />
                  </div>
               </div>

               {/* Group: Marketing & Auth */}
               <div className="grid grid-cols-1 gap-12 pt-8 border-t border-slate-50">
                  <div className="space-y-4">
                     <SectionHeader title="Auth (Google OAuth)" provider="google_oauth" relevantKeys={['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']} icon={Globe} colorClass="bg-red-50 text-red-600" />
                     <div className="grid grid-cols-1 gap-4">
                        <SettingRow label="Client ID" icon={Key} valueKey="GOOGLE_CLIENT_ID" inputWidth="sm:w-full" layout="col" />
                        <SettingRow label="Client Secret" icon={Shield} valueKey="GOOGLE_CLIENT_SECRET" type="password" inputWidth="sm:w-full" layout="col" />
                     </div>
                  </div>
               </div>

               {/* Group: Messaging */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-50">
                  <div className="space-y-4">
                     <SectionHeader title="Email (Resend)" provider="resend" relevantKeys={['RESEND_API_KEY']} icon={Mail} colorClass="bg-slate-50 text-slate-600" />
                     <SettingRow label="API Key" icon={Key} valueKey="RESEND_API_KEY" type="password" inputWidth="w-full" layout="col" />
                  </div>
                  <div className="space-y-4">
                     <SectionHeader title="WhatsApp (Fonnte)" provider="fonnte" relevantKeys={['FONNTE_API_KEY']} icon={MessageCircle} colorClass="bg-emerald-50 text-emerald-600" />
                     <SettingRow label="API Key" icon={Key} valueKey="FONNTE_API_KEY" type="password" inputWidth="w-full" layout="col" />
                  </div>
               </div>

               {/* Group: Tracking */}
               <div className="space-y-4 pt-8 border-t border-slate-50">
                  <SectionHeader title="Tracking & Tracking" provider="tracking" relevantKeys={['NEXT_PUBLIC_GA_MEASUREMENT_ID']} icon={BarChart} colorClass="bg-indigo-50 text-indigo-600" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <SettingRow label="Google Analytics ID" icon={Activity} valueKey="NEXT_PUBLIC_GA_MEASUREMENT_ID" placeholder="G-XXXXXX" inputWidth="w-full" layout="col" />
                     <SettingRow label="Meta Pixel ID" icon={ImageIcon} valueKey="NEXT_PUBLIC_META_PIXEL_ID" inputWidth="w-full" layout="col" />
                     <SettingRow label="TikTok Pixel ID" icon={ImageIcon} valueKey="NEXT_PUBLIC_TIKTOK_PIXEL_ID" inputWidth="w-full" layout="col" />
                     <SettingRow label="Maps API Key" icon={Globe} valueKey="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" inputWidth="w-full" layout="col" />
                  </div>
               </div>

               {/* Group: Search & Cloud */}
               <div className="space-y-4 pt-8 border-t border-slate-50">
                  <SectionHeader title="Cloud & Search" provider="cloud" relevantKeys={['MEILISEARCH_API_KEY']} icon={Zap} colorClass="bg-purple-50 text-purple-600" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <SettingRow label="MeiliSearch Key" icon={Search} valueKey="MEILISEARCH_API_KEY" inputWidth="w-full" layout="col" />
                     <SettingRow label="UploadThing App ID" icon={Upload} valueKey="UPLOADTHING_APP_ID" inputWidth="w-full" layout="col" />
                  </div>
               </div>

               <div className="flex justify-center pt-10">
                  <button 
                    onClick={() => handleSaveGroup(Object.keys(settings))}
                    className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-brand-600 transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                  >
                    <Save className="w-5 h-5" />
                    SIMPAN SELURUH .ENV
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'keamanan' && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <Lock className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Proteksi Keamanan</h3>
              <p className="text-slate-500 max-w-sm mt-2">Log aktivitas dan proteksi brute-force sedang disiapkan.</p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-4 right-4 sm:left-auto sm:right-10 z-[100]">
            <div className={cn("px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4", message.type === 'success' ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
               {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
               <p className="font-bold text-sm">{message.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
