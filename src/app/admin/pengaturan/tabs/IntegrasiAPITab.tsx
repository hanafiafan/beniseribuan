'use client'
import { useState } from 'react'
import { CreditCard, Bot, Image as ImageIcon, MessageSquare, Mail, RefreshCw, TestTube2, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { config: any; setConfig: (c: any) => void }

export default function IntegrasiAPITab({ config, setConfig }: Props) {
  const set = (key: string, val: string) => setConfig({ ...config, [key]: val })
  const [testing, setTesting] = useState<Record<string, 'idle' | 'loading' | 'ok' | 'fail'>>({})

  const testAPI = async (name: string, url: string) => {
    setTesting(t => ({ ...t, [name]: 'loading' }))
    try {
      const res = await fetch(url)
      setTesting(t => ({ ...t, [name]: res.ok ? 'ok' : 'fail' }))
    } catch {
      setTesting(t => ({ ...t, [name]: 'fail' }))
    }
    setTimeout(() => setTesting(t => ({ ...t, [name]: 'idle' })), 3000)
  }

  const StatusIcon = ({ name }: { name: string }) => {
    const s = testing[name]
    if (s === 'loading') return <Loader2 className="w-4 h-4 animate-spin" />
    if (s === 'ok') return <CheckCircle className="w-4 h-4 text-emerald-500" />
    if (s === 'fail') return <XCircle className="w-4 h-4 text-red-500" />
    return <TestTube2 className="w-4 h-4" />
  }

  const APICard = ({ id, title, subtitle, icon: Icon, iconColor, bgColor, borderColor, children, testUrl }: any) => (
    <div className={cn("p-8 rounded-[40px] space-y-6 border transition-all hover:shadow-md", bgColor, borderColor)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Icon className={cn("w-7 h-7", iconColor)} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900">{title}</h4>
            <p className={cn("text-[10px] uppercase font-black tracking-widest", iconColor)}>{subtitle}</p>
          </div>
        </div>
        {testUrl && (
          <button
            onClick={() => testAPI(id, testUrl)}
            className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black hover:shadow-md transition-all flex items-center gap-2"
          >
            <StatusIcon name={id} />
            {testing[id] === 'ok' ? 'Terhubung' : testing[id] === 'fail' ? 'Gagal' : 'Test Koneksi'}
          </button>
        )}
      </div>
      {children}
    </div>
  )

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-black text-slate-900 font-heading">Integrasi API & Layanan Pihak Ketiga</h3>
        <p className="text-slate-500 mt-1">Hubungkan platform dengan layanan pembayaran, AI, media penyimpanan, dan komunikasi.</p>
      </div>

      {/* Xendit */}
      <APICard id="xendit" title="Xendit Payment Gateway" subtitle="Main Financial Provider" icon={CreditCard} iconColor="text-brand-600" bgColor="bg-slate-50" borderColor="border-slate-100" testUrl="/api/admin/test-xendit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key (Production)</label>
            <input type="password" value={config.xendit_secret_key || ''} onChange={e => set('xendit_secret_key', e.target.value)} placeholder="xnd_production_..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Callback Verification Token</label>
            <input type="text" value={config.xendit_callback_token || ''} onChange={e => set('xendit_callback_token', e.target.value)} placeholder="cb_token_..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key (Development)</label>
            <input type="password" value={config.xendit_dev_key || ''} onChange={e => set('xendit_dev_key', e.target.value)} placeholder="xnd_development_..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Webhook URL</label>
            <input type="text" value={config.xendit_webhook_url || `${config.site_url || ''}/api/webhook/xendit`} onChange={e => set('xendit_webhook_url', e.target.value)} className="w-full px-5 py-4 bg-emerald-50 rounded-2xl border-none font-bold shadow-sm font-mono text-sm text-emerald-700" />
          </div>
        </div>
        <div className="flex gap-4">
          {['invoice', 'qris', 'va', 'ewallet'].map(m => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-brand-600 w-4 h-4" />
              <span className="text-xs font-bold text-slate-600 uppercase">{m}</span>
            </label>
          ))}
        </div>
      </APICard>

      {/* Gemini AI */}
      <APICard id="gemini" title="Google Gemini AI" subtitle="Content & Marketing Intelligence" icon={Bot} iconColor="text-blue-600" bgColor="bg-blue-50/30" borderColor="border-blue-100/50" testUrl="/api/admin/test-gemini">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">API Key (Google AI Studio)</label>
            <input type="password" value={config.gemini_api_key || ''} onChange={e => set('gemini_api_key', e.target.value)} placeholder="AIzaSy..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Model Aktif</label>
            <select value={config.gemini_model || 'gemini-1.5-pro'} onChange={e => set('gemini_model', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm">
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Fitur AI Aktif</label>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Deskripsi Produk', 'Reply Review', 'Caption Media Sosial'].map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-600">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </APICard>

      {/* Cloudinary */}
      <APICard id="cloudinary" title="Cloudinary Media Storage" subtitle="Global Asset Management" icon={ImageIcon} iconColor="text-indigo-600" bgColor="bg-slate-50" borderColor="border-slate-100" testUrl="/api/admin/test-cloudinary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cloud Name</label>
            <input type="text" value={config.cloudinary_cloud_name || ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="bsb-media" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Key</label>
            <input type="text" value={config.cloudinary_api_key || ''} onChange={e => set('cloudinary_api_key', e.target.value)} placeholder="123456789012345" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Secret</label>
            <input type="password" value={config.cloudinary_api_secret || ''} onChange={e => set('cloudinary_api_secret', e.target.value)} placeholder="••••••••••••••••" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Preset</label>
            <input type="text" value={config.cloudinary_upload_preset || ''} onChange={e => set('cloudinary_upload_preset', e.target.value)} placeholder="bsb_unsigned_upload" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Folder</label>
            <input type="text" value={config.cloudinary_folder || ''} onChange={e => set('cloudinary_folder', e.target.value)} placeholder="benihseribuan/products" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
        </div>
      </APICard>

      {/* Communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <APICard id="fonnte" title="WhatsApp via Fonnte" subtitle="Notifikasi & Customer Service" icon={MessageSquare} iconColor="text-emerald-600" bgColor="bg-emerald-50/30" borderColor="border-emerald-100" testUrl="/api/admin/test-fonnte">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Token</label>
              <input type="password" value={config.fonnte_token || ''} onChange={e => set('fonnte_token', e.target.value)} placeholder="fonnte_token..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor WA Pengirim</label>
              <input type="text" value={config.fonnte_sender || ''} onChange={e => set('fonnte_sender', e.target.value)} placeholder="6281234567890" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
            </div>
            <div className="flex flex-col gap-2">
              {['Notif Pesanan Baru', 'Notif Pembayaran', 'Broadcast Promo'].map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-600">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </APICard>

        <APICard id="mail" title="Email Provider" subtitle="Transaksional & Marketing" icon={Mail} iconColor="text-amber-600" bgColor="bg-amber-50/30" borderColor="border-amber-100">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</label>
              <select value={config.mail_provider || 'smtp'} onChange={e => set('mail_provider', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm">
                <option value="smtp">SMTP Custom</option>
                <option value="resend">Resend</option>
                <option value="mailchimp">Mailchimp</option>
                <option value="sendgrid">SendGrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Key / Password SMTP</label>
              <input type="password" value={config.mailchimp_key || ''} onChange={e => set('mailchimp_key', e.target.value)} placeholder="••••••••••••••••" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From Email</label>
              <input type="email" value={config.mail_from || ''} onChange={e => set('mail_from', e.target.value)} placeholder="noreply@benihseribuan.co.id" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
            </div>
          </div>
        </APICard>
      </div>
    </div>
  )
}
