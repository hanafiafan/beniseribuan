'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/toko', label: 'Toko' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/lacak-pesanan', label: 'Lacak Pesanan' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = useCartStore((s) => s.items.length)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'navbar-glass shadow-sm'
            : 'bg-white/0 dark:bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className="hidden lg:block border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8 text-xs text-gray-500 dark:text-gray-400">
            <span>🌱 Ekosistem Berkebun Terlengkap untuk Semua Orang</span>
            <div className="flex items-center gap-4">
              <span>📞 081-211-8822</span>
              <span>✉️ info@benihseribu.com</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">🌿</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-brand-700 dark:text-brand-400 leading-tight font-heading">
                  Benih
                </h1>
                <p className="text-xs text-brand-600 dark:text-brand-500 -mt-1 font-heading">
                  Seribuan
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-700 dark:hover:text-brand-400 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <ThemeToggle />

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
              </button>

              {/* Wishlist */}
              <Link
                href="/akun/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/keranjang"
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                href="/akun"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                aria-label="Account"
              >
                <User className="w-[18px] h-[18px] text-gray-600 dark:text-gray-300" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
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
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <nav className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-700 dark:hover:text-brand-400 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative max-w-2xl mx-auto mt-24 px-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari benih, pupuk, alat kebun..."
                    autoFocus
                    className="flex-1 text-lg bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Pencarian Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {['Paket Benih', 'Pupuk Organik', 'Cocopeat', 'Cabai Rawit', 'Bayam'].map(tag => (
                      <Link
                        key={tag}
                        href={`/toko?q=${encodeURIComponent(tag)}`}
                        onClick={() => setSearchOpen(false)}
                        className="px-3 py-1.5 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
