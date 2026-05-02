'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Loader2, Check, Crosshair, Map as MapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import MapPicker from './MapPicker'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  address?: any
  onSuccess: () => void
}

export default function AddressModal({ isOpen, onClose, address, onSuccess }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [formData, setFormData] = useState({
    label: address?.label || 'Rumah',
    recipientName: address?.recipientName || '',
    phone: address?.phone || '',
    province: address?.province || '',
    provinceId: address?.provinceId || '',
    city: address?.city || '',
    cityId: address?.cityId || '',
    district: address?.district || '',
    village: address?.village || '',
    postalCode: address?.postalCode || '',
    address: address?.address || '',
    latitude: address?.latitude || '',
    longitude: address?.longitude || '',
    isDefault: address?.isDefault || false
  })

  useEffect(() => {
    fetchProvinces()
    if (address?.provinceId) {
      fetchCities(address.provinceId)
    } else if (!address) {
      // Fetch user profile for new address auto-fill
      fetchUserProfile()
    }
  }, [address])

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      const user = await res.json()
      if (user && !user.error) {
        setFormData(prev => ({
          ...prev,
          recipientName: `${user.firstName} ${user.lastName || ''}`.trim(),
          phone: user.phone || ''
        }))
      }
    } catch (e) { console.error(e) }
  }

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

  const handleMapSelect = (lat: number, lng: number, details?: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }

      if (details) {
        if (details.postalCode) newData.postalCode = details.postalCode
        if (details.village) newData.village = details.village
        if (details.district) newData.district = details.district
        
        // Match province and city if possible
        if (details.province) {
          const matchedProv = provinces.find(p => 
            details.province.toLowerCase().includes(p.province.toLowerCase()) ||
            p.province.toLowerCase().includes(details.province.toLowerCase())
          )
          if (matchedProv) {
            newData.province = matchedProv.province
            newData.provinceId = matchedProv.province_id
            fetchCities(matchedProv.province_id)
          }
        }

        if (details.city && cities.length > 0) {
           const matchedCity = cities.find(c => 
             details.city.toLowerCase().includes(c.city_name.toLowerCase()) ||
             c.city_name.toLowerCase().includes(details.city.toLowerCase())
           )
           if (matchedCity) {
              newData.city = matchedCity.city_name
              newData.cityId = matchedCity.city_id
           }
        }
      }

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const url = address ? `/api/addresses/${address.id}` : '/api/addresses'
      const method = address ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="p-10 flex items-center justify-between border-b border-slate-50">
           <div>
              <h2 className="text-3xl font-black text-slate-900 font-heading">
                {address ? 'Edit Alamat' : 'Tambah Alamat Baru'}
              </h2>
              <p className="text-slate-500 font-medium">Lengkapi detail tujuan pengiriman Anda.</p>
           </div>
           <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
              <X className="w-6 h-6" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-50 rounded-[24px]">
              {['Rumah', 'Kantor', 'Lainnya'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData({...formData, label})}
                  className={cn(
                    "py-3 rounded-2xl font-black text-xs transition-all",
                    formData.label === label ? "bg-white text-brand-600 shadow-lg shadow-slate-200" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {label}
                </button>
              ))}
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Penerima</label>
                 <input 
                   type="text" 
                   value={formData.recipientName}
                   onChange={e => setFormData({...formData, recipientName: e.target.value})}
                   placeholder="Misal: Budi Santoso"
                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor Telepon (WA)</label>
                 <input 
                   type="tel" 
                   value={formData.phone}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                   placeholder="0812..."
                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
                   required
                 />
              </div>
           </div>

           {/* Kode Pos & Map Trigger */}
           <div className="grid md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kode Pos</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={formData.postalCode}
                      onChange={e => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="Contoh: 12345"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
                      required
                    />
                 </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={cn(
                  "flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-widest",
                  showMap ? "bg-brand-50 border-brand-200 text-brand-600 shadow-inner" : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"
                )}
              >
                <MapIcon className="w-5 h-5" />
                {showMap ? 'Tutup Peta' : 'Pilih di Peta'}
              </button>
           </div>

           {showMap && (
             <div className="animate-in slide-in-from-top-4 fade-in duration-300">
               <MapPicker 
                 onSelect={handleMapSelect} 
                 initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
                 initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
               />
             </div>
           )}

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Provinsi</label>
                 <select 
                    value={formData.provinceId}
                    onChange={e => {
                      const p = provinces.find(x => x.province_id === e.target.value)
                      if (p) {
                        setFormData({...formData, provinceId: e.target.value, province: p.province})
                        fetchCities(e.target.value)
                      }
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold appearance-none"
                    required
                 >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kota / Kabupaten</label>
                 <select 
                    value={formData.cityId}
                    onChange={e => {
                      const c = cities.find(x => x.city_id === e.target.value)
                      if (c) {
                        setFormData({...formData, cityId: e.target.value, city: c.city_name, postalCode: c.postal_code || formData.postalCode})
                      }
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold appearance-none"
                    required
                 >
                    <option value="">Pilih Kota</option>
                    {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>)}
                 </select>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kecamatan</label>
                 <input 
                   type="text" 
                   value={formData.district}
                   onChange={e => setFormData({...formData, district: e.target.value})}
                   placeholder="Masukkan nama kecamatan"
                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Desa / Kelurahan</label>
                 <input 
                   type="text" 
                   value={formData.village}
                   onChange={e => setFormData({...formData, village: e.target.value})}
                   placeholder="Masukkan nama desa"
                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Lengkap</label>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Nama jalan, Nomor rumah, RT/RW, Patokan..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold h-24 resize-none"
                required
              />
           </div>

           <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-brand-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all flex items-center justify-center gap-3"
              >
                 {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                 ) : (
                    <>
                       <Check className="w-6 h-6" />
                       {address ? 'Simpan Perubahan' : 'Simpan Alamat'}
                    </>
                 )}
              </button>
           </div>
        </form>
      </div>
    </div>
  )
}

