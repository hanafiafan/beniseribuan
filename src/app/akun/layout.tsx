'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Download, 
  MapPin, 
  User, 
  Heart, 
  LogOut, 
  Settings,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/akun', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/akun/pesanan', label: 'Pesanan Saya', icon: ShoppingBag },
  { href: '/akun/unduhan', label: 'Produk Digital', icon: Download },
  { href: '/akun/alamat', label: 'Daftar Alamat', icon: MapPin },
  { href: '/akun/profil', label: 'Detail Profil', icon: User },
  { href: '/akun/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/akun/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f0d] pb-24">
      {/* Header Banner */}
      <div className="bg-brand-900 h-48 lg:h-64 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leaf-400 rounded-full blur-[100px] -ml-24 -mb-24" />
         </div>
         <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12 relative z-10">
            <h1 className="text-3xl lg:text-4xl font-black text-white font-heading">Akun Saya</h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
             <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-xl shadow-black/5 overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* User Info */}
                <div className="p-8 text-center border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                   <div className="w-24 h-24 mx-auto rounded-[32px] bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-3xl font-black text-brand-700 mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
                      AR
                   </div>
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">As'ad RUN</h3>
                   <p className="text-xs text-gray-500 font-medium">Member sejak April 2024</p>
                </div>

                {/* Nav Links */}
                <nav className="p-4">
                   <ul className="space-y-1">
                      {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                          <li key={link.href}>
                            <Link 
                              href={link.href}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                isActive 
                                  ? "bg-brand-700 text-white shadow-lg shadow-brand-700/20" 
                                  : "text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700"
                              )}
                            >
                               <div className="flex items-center gap-4">
                                  <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-brand-700")} />
                                  <span className="text-sm font-bold">{link.label}</span>
                               </div>
                               <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                            </Link>
                          </li>
                        )
                      })}
                      <li className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700">
                         <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Keluar</span>
                         </button>
                      </li>
                   </ul>
                </nav>
             </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
             <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-xl shadow-black/5 p-8 lg:p-12 border border-gray-100 dark:border-gray-700 min-h-[600px]">
                {children}
             </div>
          </main>

        </div>
      </div>
    </div>
  )
}
