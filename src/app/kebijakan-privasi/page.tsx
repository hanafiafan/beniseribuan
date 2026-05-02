import { Lock, Eye, ShieldCheck, Database } from 'lucide-react'

export default function KebijakanPrivasiPage() {
  return (
    <div className="container-custom py-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-heading">Kebijakan <span className="text-blue-600">Privasi</span></h1>
          <p className="text-slate-500 font-medium">Melindungi data Anda adalah prioritas utama kami.</p>
        </header>

        <div className="glass-panel rounded-[48px] p-8 md:p-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-[32px] bg-blue-50/50 border border-blue-100 space-y-4">
              <Eye className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-black text-slate-900">Transparansi</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Kami hanya mengumpulkan data yang benar-benar dibutuhkan untuk memproses pesanan Anda.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-brand-50/50 border border-brand-100 space-y-4">
              <ShieldCheck className="w-8 h-8 text-brand-600" />
              <h3 className="text-xl font-black text-slate-900">Keamanan</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Data Anda disimpan dengan enkripsi standar industri dan tidak akan pernah dijual.</p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Database className="w-6 h-6 text-slate-400" />
              Informasi yang Kami Kumpulkan
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Saat Anda melakukan transaksi atau mendaftar akun di Benih Seribuan, kami mengumpulkan data berikut:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Identitas: Nama lengkap dan alamat email.</li>
                <li>Kontak: Nomor WhatsApp untuk pengiriman & notifikasi.</li>
                <li>Pengiriman: Alamat lengkap untuk tujuan pengiriman paket.</li>
                <li>Teknis: Alamat IP dan data browser untuk keamanan (anti-fraud).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-slate-400" />
              Bagaimana Kami Menggunakan Data Anda
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Data Anda digunakan secara eksklusif untuk:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Memproses pesanan dan pembayaran via Xendit.</li>
                <li>Menghitung ongkos kirim via RajaOngkir.</li>
                <li>Mengirim notifikasi status pesanan via WhatsApp/Email.</li>
                <li>Meningkatkan pengalaman belanja Anda di situs kami.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Lock className="w-6 h-6 text-slate-400" />
              Hak Anda
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Anda memiliki hak penuh untuk meminta penghapusan data akun Anda dari database kami kapan saja dengan menghubungi layanan pelanggan kami.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
