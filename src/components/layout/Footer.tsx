import Link from 'next/link'
import { Facebook, Instagram, Linkedin, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  belanja: [
    { label: 'Semua Produk', href: '/toko' },
    { label: 'Paket Benih', href: '/toko?category=paket-benih' },
    { label: 'Pupuk & Nutrisi', href: '/toko?category=pupuk-nutrisi' },
    { label: 'Media Tanam', href: '/toko?category=media-tanam' },
    { label: 'Promo Spesial', href: '/toko?status=promo' },
  ],
  bantuan: [
    { label: 'Cara Order', href: '/artikel/cara-order' },
    { label: 'Lacak Pesanan', href: '/lacak-pesanan' },
    { label: 'Hubungi Kami', href: '/tentang-kami#kontak' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
  ],
  perusahaan: [
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Artikel Berkebun', href: '/artikel' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Kemitraan', href: '/partnership' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#0a0f0d] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">🌿</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-700 dark:text-brand-400 font-heading leading-tight">
                  Benih Seribuan
                </h2>
                <p className="text-xs text-brand-600 dark:text-brand-500 font-heading">
                  Solusi Kebun Rumah Tangga
                </p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Kami adalah Benih Seribuan — sebuah komunitas dan penyedia benih yang berkomitmen mempermudah siapa pun dalam memulai petualangan berkebun mereka. Didirikan pada tahun 2020 di Boyolali.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'Linkedin' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 font-heading">Belanja</h3>
            <ul className="space-y-4">
              {footerLinks.belanja.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 font-heading">Bantuan</h3>
            <ul className="space-y-4">
              {footerLinks.bantuan.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 font-heading">Kontak Kami</h3>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-700 dark:text-brand-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Dk. Tegalsari, Tegal Sari, Tambak, Kec. Mojosongo, Kabupaten Boyolali, Jawa Tengah 57322
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-700 dark:text-brand-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">WhatsApp</p>
                  <a href="tel:+62812118822" className="text-gray-600 dark:text-gray-400 hover:text-brand-700">081-211-8822</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-700 dark:text-brand-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">Email</p>
                  <a href="mailto:info@benihseribu.com" className="text-gray-600 dark:text-gray-400 hover:text-brand-700">info@benihseribu.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Shipping Logos Placeholder */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8 flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Replace with actual SVG logos from icons later */}
             <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Payment & Shipping Partners</span>
             <div className="flex gap-4">
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
             </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Benih Seribuan. Built by <span className="text-brand-700 dark:text-brand-500 font-bold">PT. Mutiara Benih Nusantara</span>.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
             <Link href="/sitemap" className="hover:text-brand-700">Sitemap</Link>
             <Link href="/faq" className="hover:text-brand-700">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
