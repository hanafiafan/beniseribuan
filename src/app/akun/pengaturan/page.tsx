'use client'
import { Bell, Shield, Smartphone, HelpCircle } from 'lucide-react'

export default function PengaturanPage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading tracking-tight">Pengaturan</h2>
        <p className="text-slate-500 font-medium">Atur preferensi akun dan keamanan Anda.</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Notifikasi', desc: 'Atur bagaimana Anda menerima pembaruan.', icon: Bell },
          { label: 'Keamanan Akun', desc: 'Ubah kata sandi dan aktifkan 2FA.', icon: Shield },
          { label: 'Tampilan Aplikasi', desc: 'Personalisasi antarmuka Anda.', icon: Smartphone },
          { label: 'Bantuan & Dukungan', desc: 'Butuh bantuan? Kami siap membantu.', icon: HelpCircle },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-black/5 transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-50">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-brand-600 transition-colors">
              <HelpCircle className="w-4 h-4 rotate-[-90deg]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
