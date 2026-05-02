'use client'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ProfilPage() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading tracking-tight">Detail Profil</h2>
        <p className="text-slate-500 font-medium">Kelola informasi pribadi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nama Lengkap</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <User className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-700">{user?.name || '-'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Alamat Email</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <Mail className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-700">{user?.email || '-'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nomor Telepon</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-300 italic">
            <Phone className="w-5 h-5" />
            <span>Belum ditambahkan</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Bergabung Sejak</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-700">April 2026</span>
          </div>
        </div>
      </div>

      <button className="px-8 py-4 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
        Simpan Perubahan
      </button>
    </div>
  )
}
