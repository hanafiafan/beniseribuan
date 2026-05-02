import { Shield, FileText, CheckCircle2 } from 'lucide-react'

export default function SyaratKetentuanPage() {
  return (
    <div className="container-custom py-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-heading">Syarat & <span className="text-gradient-brand">Ketentuan</span></h1>
          <p className="text-slate-500 font-medium">Terakhir diperbarui: 24 April 2026</p>
        </header>

        <div className="glass-panel rounded-[48px] p-8 md:p-16 space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm">1</span>
              Ketentuan Umum
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Selamat datang di Benih Seribuan. Dengan mengakses dan menggunakan situs web ini, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini.</p>
              <p>Layanan kami ditujukan untuk pembelian produk pertanian, benih, dan alat kebun. Kami berhak untuk menolak layanan kepada siapapun dengan alasan apapun kapanpun.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm">2</span>
              Pembelian & Pembayaran
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Semua harga yang tercantum adalah dalam Rupiah (IDR). Kami berhak mengubah harga sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</p>
              <ul className="list-none space-y-3">
                {[
                  'Pembayaran harus dilakukan secara penuh melalui metode yang tersedia (Xendit).',
                  'Pesanan akan diproses setelah konfirmasi pembayaran diterima.',
                  'Pembatalan pesanan tidak dapat dilakukan jika status sudah masuk tahap pengemasan.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm">3</span>
              Pengiriman & Barang
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
              <p>Kami bekerja sama dengan kurir pihak ketiga (JNE, POS, TIKI) untuk pengiriman. Tanggung jawab atas keterlambatan atau kerusakan selama pengiriman berada pada pihak kurir, namun kami akan membantu proses klaim.</p>
              <p>Khusus benih tanaman, daya tumbuh sangat dipengaruhi oleh cara semai dan lingkungan. Kami tidak menjamin 100% daya tumbuh jika terjadi kegagalan akibat kelalaian pembeli.</p>
            </div>
          </section>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex gap-4">
             <Shield className="w-6 h-6 text-brand-600 shrink-0 mt-1" />
             <p className="text-sm text-slate-500 font-medium italic">
               Dengan membuat akun atau melakukan transaksi di Benih Seribuan, Anda dianggap setuju secara sah terhadap dokumen Syarat & Ketentuan ini.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
