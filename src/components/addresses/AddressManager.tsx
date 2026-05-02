'use client'

import { useState } from 'react'
import { 
  MapPin, Plus, Edit2, Trash2, CheckCircle2, 
  Home, Briefcase, Map as MapIcon, Loader2,
  MoreVertical, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AddressModal from './AddressModal'
import { useRouter } from 'next/navigation'

interface AddressManagerProps {
  initialAddresses: any[]
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isSettingDefault, setIsSettingDefault] = useState<number | null>(null)
  const router = useRouter()

  const handleSetDefault = async (id: number) => {
    setIsSettingDefault(id)
    try {
      const res = await fetch(`/api/addresses/${id}/default`, { method: 'PATCH' })
      if (res.ok) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        })))
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSettingDefault(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return
    setIsDeleting(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleOpenModal = (address: any = null) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => handleOpenModal()}
          className="group flex items-center gap-3 px-8 py-4 bg-brand-600 text-white rounded-[24px] font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all hover:-translate-y-1"
        >
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          Tambah Alamat Baru
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-16 rounded-[48px] bg-slate-50 border border-slate-100 text-center relative overflow-hidden group">
           <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <MapPin className="w-12 h-12 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-3 font-heading">Alamat belum ditambahkan</h3>
           <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto mb-8 leading-relaxed">
              Tambahkan alamat pengiriman untuk mempermudah proses checkout Anda.
           </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div 
              key={address.id}
              className={cn(
                "relative p-8 rounded-[40px] bg-white border-2 transition-all duration-300 group",
                address.isDefault ? "border-brand-600 shadow-xl shadow-brand-500/10" : "border-slate-100 hover:border-brand-200"
              )}
            >
              {address.isDefault && (
                <div className="absolute top-6 right-6 px-4 py-1.5 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-500/20 flex items-center gap-2">
                   <CheckCircle2 className="w-3 h-3" />
                   Alamat Utama
                </div>
              )}

              <div className="flex items-start gap-5 mb-6">
                 <div className={cn(
                   "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                   address.label?.toLowerCase() === 'rumah' ? "bg-brand-50 text-brand-600" : 
                   address.label?.toLowerCase() === 'kantor' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
                 )}>
                    {address.label?.toLowerCase() === 'rumah' ? <Home className="w-6 h-6" /> : 
                     address.label?.toLowerCase() === 'kantor' ? <Briefcase className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />}
                 </div>
                 <div>
                    <h4 className="font-black text-slate-900 text-lg font-heading leading-tight mb-1">{address.label}</h4>
                    <p className="text-sm font-bold text-slate-400">{address.recipientName}</p>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                    <span>{address.address}, {address.district}, {address.city}, {address.province}, {address.postalCode}</span>
                 </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                 {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isSettingDefault === address.id}
                      className="flex-1 py-3.5 rounded-xl border-2 border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                       {isSettingDefault === address.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                       Jadikan Utama
                    </button>
                 )}
                 <button 
                   onClick={() => handleOpenModal(address)}
                   className="p-3.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:border-brand-200 hover:text-brand-600 transition-all"
                 >
                    <Edit2 className="w-4 h-4" />
                 </button>
                 {!address.isDefault && (
                    <button 
                      onClick={() => handleDelete(address.id)}
                      disabled={isDeleting === address.id}
                      className="p-3.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:border-red-200 hover:text-red-500 transition-all"
                    >
                       {isDeleting === address.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddressModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          address={editingAddress}
          onSuccess={() => {
            setIsModalOpen(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
