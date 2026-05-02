'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Mail, Phone, MapPin, 
  ChevronRight, Leaf,
  Camera, Share2, Send, Play
} from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="relative bg-slate-50 pt-24 pb-12 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-100/30 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 font-heading tracking-tight">
                Benih<span className="text-brand-600">seribuan</span>
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed">
              Mewujudkan mimpi setiap keluarga Indonesia memiliki kebun sendiri. Benih berkualitas premium dengan harga paling jujur.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Camera, href: '#' },
                { icon: Share2, href: '#' },
                { icon: Send, href: '#' },
                { icon: Play, href: '#' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:shadow-lg transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8 font-heading">Belanja & Layanan</h4>
            <ul className="space-y-4">
              {[
                { label: 'Semua Produk', href: '/toko' },
                { label: 'Paket Hemat', href: '/toko?category=paket-benih-hemat' },
                { label: 'Lacak Pesanan', href: '/lacak-pesanan' },
                { label: 'Cara Menanam', href: '/artikel' },
                { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-500 font-medium hover:text-brand-600 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-brand-300 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8 font-heading">Tentang Kami</h4>
            <ul className="space-y-4">
              {[
                { label: 'Cerita Kami', href: '/tentang-kami' },
                { label: 'Hubungi Kami', href: '#' },
                { label: 'Peluang Reseller', href: '#' },
                { label: 'Testimoni', href: '#' },
                { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-500 font-medium hover:text-brand-600 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-brand-300 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-8 font-heading">Hubungi Kami</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Jl. Raya Solo-Semarang, Boyolali, Jawa Tengah 57382
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-sm text-slate-500 font-bold">+62 812 3456 7890</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-sm text-slate-500 font-bold">halo@benihseribuan.co.id</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-400 font-medium">
            &copy; {currentYear} Benih Seribuan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Logo_GPN.png" alt="GPN" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  )
}
