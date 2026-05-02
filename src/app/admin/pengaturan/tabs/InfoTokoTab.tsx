'use client'
import { Globe, MapPin, Phone, Mail, Clock, Upload, AtSign, Share2, PlayCircle, Send } from 'lucide-react'

interface Props { config: any; setConfig: (c: any) => void }

export default function InfoTokoTab({ config, setConfig }: Props) {
  const set = (key: string, val: string) => setConfig({ ...config, [key]: val })
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-black text-slate-900 font-heading">Identitas Toko</h3>
        <p className="text-slate-500 mt-1">Kelola semua informasi brand dan lokasi bisnis Anda.</p>
      </div>

      {/* Brand Identity */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-600" /> Identitas Brand
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Toko</label>
            <input value={config.site_name || ''} onChange={e => set('site_name', e.target.value)} placeholder="Benih Seribuan" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tagline / Slogan</label>
            <input value={config.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)} placeholder="Tanaman Terbaik untuk Rumah Anda" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Resmi</label>
            <input type="email" value={config.site_email || ''} onChange={e => set('site_email', e.target.value)} placeholder="hello@benihseribuan.com" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor WhatsApp CS</label>
            <input value={config.site_whatsapp || ''} onChange={e => set('site_whatsapp', e.target.value)} placeholder="628123456789" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Telepon</label>
            <input value={config.site_phone || ''} onChange={e => set('site_phone', e.target.value)} placeholder="+62 21 xxxx xxxx" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website URL</label>
            <input value={config.site_url || ''} onChange={e => set('site_url', e.target.value)} placeholder="https://benihseribuan.co.id" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo URL (Light)</label>
            <div className="flex gap-3">
              <input value={config.site_logo || ''} onChange={e => set('site_logo', e.target.value)} placeholder="https://..." className="flex-1 px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
              <button className="px-4 py-4 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-100 transition-all">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo URL (Dark/Favicon)</label>
            <div className="flex gap-3">
              <input value={config.site_logo_dark || ''} onChange={e => set('site_logo_dark', e.target.value)} placeholder="https://..." className="flex-1 px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
              <button className="px-4 py-4 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-100 transition-all">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Toko (SEO)</label>
          <textarea value={config.site_description || ''} onChange={e => set('site_description', e.target.value)} rows={3} placeholder="Platform belanja tanaman dan benih terpercaya di Indonesia..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm resize-none" />
        </div>
      </div>

      {/* Location & Address */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" /> Lokasi & Alamat
        </h4>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Lengkap</label>
          <textarea value={config.site_address || ''} onChange={e => set('site_address', e.target.value)} rows={3} placeholder="Jl. Raya Tanaman No. 1, RT 01/RW 01, Kelurahan Hijau, Kecamatan Asri, Kota Seribuan" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kota</label>
            <input value={config.site_city || ''} onChange={e => set('site_city', e.target.value)} placeholder="Jakarta Selatan" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provinsi</label>
            <input value={config.site_province || ''} onChange={e => set('site_province', e.target.value)} placeholder="DKI Jakarta" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Pos</label>
            <input value={config.site_postal_code || ''} onChange={e => set('site_postal_code', e.target.value)} placeholder="12345" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude (Koordinat)</label>
            <input value={config.site_latitude || ''} onChange={e => set('site_latitude', e.target.value)} placeholder="-6.2088" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude (Koordinat)</label>
            <input value={config.site_longitude || ''} onChange={e => set('site_longitude', e.target.value)} placeholder="106.8456" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Maps Embed URL</label>
          <input value={config.site_maps_embed || ''} onChange={e => set('site_maps_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
        </div>
      </div>

      {/* Business Hours */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" /> Jam Operasional
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senin - Jumat</label>
            <input value={config.hours_weekday || ''} onChange={e => set('hours_weekday', e.target.value)} placeholder="08:00 - 17:00 WIB" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sabtu - Minggu</label>
            <input value={config.hours_weekend || ''} onChange={e => set('hours_weekend', e.target.value)} placeholder="09:00 - 15:00 WIB" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Media Sosial</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'social_instagram', label: 'Instagram', icon: AtSign, color: 'text-pink-600', placeholder: 'https://instagram.com/benihseribuan' },
            { key: 'social_facebook', label: 'Facebook', icon: Share2, color: 'text-blue-600', placeholder: 'https://facebook.com/benihseribuan' },
            { key: 'social_youtube', label: 'YouTube', icon: PlayCircle, color: 'text-red-600', placeholder: 'https://youtube.com/@benihseribuan' },
            { key: 'social_twitter', label: 'X / Twitter', icon: Send, color: 'text-slate-800', placeholder: 'https://twitter.com/benihseribuan' },
          ].map(({ key, label, icon: Icon, color, placeholder }) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon className={`w-3 h-3 ${color}`} /> {label}
              </label>
              <input value={config[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TikTok Shop</label>
          <input value={config.social_tiktok || ''} onChange={e => set('social_tiktok', e.target.value)} placeholder="https://tiktok.com/@benihseribuan" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm" />
        </div>
      </div>
    </div>
  )
}
