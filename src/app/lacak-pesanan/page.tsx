'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, Info, Clock } from 'lucide-react'

export default function LacakPesananPage() {
  const [orderId, setOrderId] = useState('')
  const [isTracking, setIsTracking] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTracking(true)
    // Simulate API call
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <Truck className="w-10 h-10 text-brand-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 font-heading">Lacak Pesanan</h1>
          <p className="text-slate-500 font-medium">Masukkan nomor pesanan atau resi untuk melihat status paket Anda.</p>
        </header>

        <div className="glass-panel rounded-[40px] p-8 md:p-12 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                Nomor Pesanan / Resi
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Contoh: BSB-2024-XXXX"
                  className="w-full px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm font-bold text-slate-800"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Cari
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700 text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <p>Nomor pesanan dapat Anda temukan pada email konfirmasi atau dashboard akun Anda.</p>
            </div>
          </form>
        </div>

        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-panel rounded-[40px] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status Saat Ini</p>
                  <h3 className="text-2xl font-black text-brand-600 font-heading">Dalam Pengiriman</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estimasi Tiba</p>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">Besok, 16:00</h3>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {[
                  { status: 'Pesanan Diterima', time: '14 Apr, 09:00', done: true },
                  { status: 'Paket Sedang Dikemas', time: '14 Apr, 14:30', done: true },
                  { status: 'Paket Diserahkan ke Kurir', time: '15 Apr, 08:00', done: true },
                  { status: 'Sedang Menuju Alamat Anda', time: '15 Apr, 10:00', done: false },
                ].map((step, i) => (
                  <div key={i} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 transition-colors ${
                      step.done ? 'bg-brand-600' : 'bg-slate-200'
                    }`}>
                      {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-slate-400" />}
                    </div>
                    <h4 className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</h4>
                    <p className="text-xs text-slate-500 font-medium">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
