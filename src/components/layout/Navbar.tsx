'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Globe, Leaf } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useUIStore } from '@/lib/store/useUIStore'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/toko', label: 'Toko' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/lacak-pesanan', label: 'Lacak Pesanan' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const { data: session, status } = useSession()
  const { openLoginModal } = useUIStore()
  const isLoggedIn = status === 'authenticated'
  const user = session?.user

  const cartCount = useCartStore((s) => s.items.length)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live Search Logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          const data = await res.json()
          setSearchResults(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error(error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  const [themeEnabled, setThemeEnabled] = useState(false)
  
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.theme_switcher_enabled === 'true') {
          setThemeEnabled(true)
        }
      })
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-slate-100 shadow-xl shadow-brand-950/5 py-2'
            : 'bg-white/40 backdrop-blur-md border-white/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-brand-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-brand-500/20">
                <Leaf className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none font-heading tracking-tight">
                  Benih<span className="text-brand-600">seribuan</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-0.5">
                  Fresh & Quality
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-brand-600 rounded-xl hover:bg-brand-50 transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 w-0 h-1 bg-brand-500 rounded-full transition-all duration-300 group-hover:w-4 group-hover:left-4" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {themeEnabled && <ThemeToggle />}
              
              {/* Search (Icon only on small mobile) */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-brand-50 transition-colors group"
              >
                <Search className="w-5 h-5 text-slate-500 group-hover:text-brand-600" />
              </button>

              {/* Wishlist */}
              <Link
                href="/akun/wishlist"
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-brand-50 transition-colors group"
              >
                <Heart className="w-5 h-5 text-slate-500 group-hover:text-brand-600" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/keranjang"
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-brand-50 transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 text-slate-500 group-hover:text-brand-600" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

              {/* User Account */}
              {isLoggedIn ? (
                <Link
                  href="/akun"
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-sm overflow-hidden"
                >
                  {user?.image ? (
                    <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-brand-50 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl"
            >
              <nav className="px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-bold text-slate-700 hover:text-brand-600 rounded-2xl hover:bg-brand-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-50">
                  {isLoggedIn ? (
                    <Link
                      href="/akun"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-4 bg-brand-600 text-white rounded-2xl font-black justify-center shadow-lg shadow-brand-500/20"
                    >
                      <User className="w-5 h-5" />
                      Dashboard Akun
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        openLoginModal()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-4 bg-brand-600 text-white rounded-2xl font-black justify-center shadow-lg shadow-brand-500/20"
                    >
                      <User className="w-5 h-5" />
                      Masuk ke Akun
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="relative w-full max-w-2xl"
            >
              <div className="glass-panel rounded-[32px] p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-brand-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari benih premium..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-xl font-medium bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="mt-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                   {isSearching ? (
                      <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                         <div className="w-8 h-8 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin mb-4" />
                         <p className="text-xs font-black uppercase tracking-widest">Mencari Benih Terbaik...</p>
                      </div>
                   ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hasil Produk ({searchResults.length})</p>
                         {searchResults.map((p) => (
                           <Link 
                             key={p.id} 
                             href={`/produk/${p.slug}`}
                             onClick={() => {
                               setSearchOpen(false)
                               setSearchQuery('')
                               setSearchResults([])
                             }}
                             className="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-50 transition-all group"
                           >
                              <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-white shrink-0">
                                 <img src={p.images?.[0]?.url || '/images/placeholder.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5 group-hover:text-brand-600">{p.name}</h4>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{p.category?.name}</p>
                              </div>
                              <div className="text-right">
                                 <p className="font-black text-brand-600 text-sm">Rp {Number(p.salePrice || p.price).toLocaleString('id-ID')}</p>
                              </div>
                           </Link>
                         ))}
                      </div>
                   ) : searchQuery.length >= 2 ? (
                      <div className="py-10 text-center">
                         <p className="text-slate-400 font-bold italic">Tidak menemukan benih "{searchQuery}"</p>
                      </div>
                   ) : (
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pencarian Populer</p>
                        <div className="flex flex-wrap gap-2">
                          {['Paket Berkebun', 'Pupuk Organik', 'Bibit Cabai', 'Bayam Jepang', 'Pot Estetik'].map(tag => (
                            <button
                              key={tag}
                              onClick={() => setSearchQuery(tag)}
                              className="px-4 py-2 text-sm font-bold bg-slate-50 text-slate-600 rounded-xl hover:bg-brand-600 hover:text-white transition-all duration-300"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
