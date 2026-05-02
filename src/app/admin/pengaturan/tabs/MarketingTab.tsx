'use client'
import { BarChart3, Share2, Activity, Eye, MousePointer, TrendingUp } from 'lucide-react'

interface Props { config: any; setConfig: (c: any) => void }

export default function MarketingTab({ config, setConfig }: Props) {
  const set = (key: string, val: string) => setConfig({ ...config, [key]: val })
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-black text-slate-900 font-heading">Marketing & Pixel Tracking</h3>
        <p className="text-slate-500 mt-1">Lacak konversi, perilaku pengunjung, dan optimasi kampanye iklan berbayar.</p>
      </div>

      {/* GA4 */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <BarChart3 className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">Google Analytics 4 (GA4)</h4>
              <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">Website Analytics & Behavior</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600">Live Tracking</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Measurement ID</label>
            <input value={config.ga4_id || ''} onChange={e => set('ga4_id', e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Secret (Measurement Protocol)</label>
            <input type="password" value={config.ga4_secret || ''} onChange={e => set('ga4_secret', e.target.value)} placeholder="••••••••••••••••" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {[{ label: 'Page Views', icon: Eye }, { label: 'Click Events', icon: MousePointer }, { label: 'Conversion Tracking', icon: TrendingUp }].map(({ label, icon: Icon }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl shadow-sm">
              <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4" />
              <Icon className="w-3 h-3 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Meta Pixel */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Share2 className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">Meta Pixel (Facebook & Instagram Ads)</h4>
            <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest">Social Commerce Conversion</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pixel ID</label>
            <input value={config.fb_pixel_id || ''} onChange={e => set('fb_pixel_id', e.target.value)} placeholder="1234567890123456" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversions API Token (CAPI)</label>
            <input type="password" value={config.fb_capi_token || ''} onChange={e => set('fb_capi_token', e.target.value)} placeholder="EAAxxxxxx..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Events yang Dilacak</label>
          <div className="flex flex-wrap gap-3">
            {['ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Search', 'Lead'].map(e => (
              <label key={e} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm">
                <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
                <span className="text-xs font-bold text-slate-600">{e}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* TikTok Pixel */}
      <div className="p-8 bg-pink-50/30 rounded-[40px] space-y-6 border border-pink-100/50">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Activity className="w-7 h-7 text-pink-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">TikTok Pixel & Shop</h4>
            <p className="text-[10px] text-pink-500 uppercase font-black tracking-widest">TikTok For Business</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pixel ID</label>
            <input value={config.tiktok_pixel_id || ''} onChange={e => set('tiktok_pixel_id', e.target.value)} placeholder="CXXXXXXXXXXXXXXXXX" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Token (Events API)</label>
            <input type="password" value={config.tiktok_access_token || ''} onChange={e => set('tiktok_access_token', e.target.value)} placeholder="••••••••••••••••" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono" />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">SEO Global Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Search Console Verification</label>
            <input value={config.gsc_verification || ''} onChange={e => set('gsc_verification', e.target.value)} placeholder="google-site-verification=..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bing Webmaster Verification</label>
            <input value={config.bing_verification || ''} onChange={e => set('bing_verification', e.target.value)} placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Head Scripts (Google Tag Manager, dll)</label>
            <textarea value={config.custom_head_scripts || ''} onChange={e => set('custom_head_scripts', e.target.value)} rows={4} placeholder="<!-- GTM or custom scripts -->" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold text-slate-900 shadow-sm resize-none font-mono text-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}
