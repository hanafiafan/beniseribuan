'use client'
import { Truck, MapPin, Package, Weight, DollarSign } from 'lucide-react'

interface Props { config: any; setConfig: (c: any) => void }

export default function LogistikTab({ config, setConfig }: Props) {
  const set = (key: string, val: string) => setConfig({ ...config, [key]: val })
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-black text-slate-900 font-heading">Logistik & Pengiriman</h3>
        <p className="text-slate-500 mt-1">Konfigurasi biaya kirim, kurir, dan integrasi maps untuk kalkulasi ongkir real-time.</p>
      </div>

      {/* RajaOngkir */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Truck className="w-7 h-7 text-brand-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">RajaOngkir API</h4>
              <p className="text-[10px] text-brand-600 uppercase font-black tracking-widest">Kalkulasi Ongkos Kirim Real-Time</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-brand-100 text-brand-700 text-[10px] font-black rounded-full uppercase tracking-wider">Pro Plan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Key</label>
            <input type="password" value={config.rajaongkir_key || ''} onChange={e => set('rajaongkir_key', e.target.value)} placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paket Plan</label>
            <select value={config.rajaongkir_plan || 'pro'} onChange={e => set('rajaongkir_plan', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm">
              <option value="starter">Starter</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kota Asal (ID Kota RajaOngkir)</label>
            <input value={config.rajaongkir_origin_city || ''} onChange={e => set('rajaongkir_origin_city', e.target.value)} placeholder="501 (Jakarta Selatan)" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kurir Default</label>
            <div className="flex flex-wrap gap-3 pt-2">
              {['JNE', 'J&T', 'SiCepat', 'AnterAja', 'GoSend', 'GrabExpress'].map(k => (
                <label key={k} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm">
                  <input type="checkbox" defaultChecked className="accent-brand-600 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-600">{k}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-500" /> Konfigurasi Pengiriman
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat Default (gram)</label>
            <input type="number" value={config.default_weight || '200'} onChange={e => set('default_weight', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gratis Ongkir min. Pembelian (Rp)</label>
            <input type="number" value={config.free_shipping_min || '150000'} onChange={e => set('free_shipping_min', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biaya Penanganan (Rp)</label>
            <input type="number" value={config.handling_fee || '0'} onChange={e => set('handling_fee', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimasi Packing (hari kerja)</label>
            <input value={config.packing_days || '1-2'} onChange={e => set('packing_days', e.target.value)} placeholder="1-2" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Pengiriman Lokal (Flat Rate)</label>
            <input type="number" value={config.flat_rate || '15000'} onChange={e => set('flat_rate', e.target.value)} placeholder="15000" className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm" />
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="p-8 bg-slate-50 rounded-[40px] space-y-6 border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <MapPin className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">Google Maps Platform</h4>
            <p className="text-[10px] text-red-400 uppercase font-black tracking-widest">Address Autocomplete & Distance Matrix</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Browser API Key (Places API)</label>
            <input type="password" value={config.google_maps_key || ''} onChange={e => set('google_maps_key', e.target.value)} placeholder="AIzaSy..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server API Key (Distance Matrix)</label>
            <input type="password" value={config.google_maps_server_key || ''} onChange={e => set('google_maps_server_key', e.target.value)} placeholder="AIzaSy..." className="w-full px-5 py-4 bg-white rounded-2xl border-none font-bold shadow-sm font-mono text-sm" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Places Autocomplete', 'Distance Matrix', 'Geocoding', 'Maps Embed'].map(f => (
            <label key={f} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm">
              <input type="checkbox" defaultChecked className="accent-red-500 w-4 h-4" />
              <span className="text-xs font-bold text-slate-600">{f}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
