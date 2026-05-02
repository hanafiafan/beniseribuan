'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Download, 
  MapPin, 
  User, 
  Heart, 
  LogOut, 
  Settings,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumbs from '@/components/common/Breadcrumbs'

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
  const { data: session } = useSession()
  const user = session?.user

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Banner */}
      <div className="bg-brand-50 h-48 lg:h-64 relative overflow-hidden border-b border-brand-100">
         <div className="absolute inset-0 opacity-40">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100 rounded-full blur-[100px] -ml-24 -mb-24" />
         </div>
         <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12 relative z-10">
            <div>
              <Breadcrumbs />
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight mb-2">Akun Saya</h1>
              <p className="text-slate-500 font-medium">Kelola profil, pesanan, dan pengaturan akun Anda.</p>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
             <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                {/* User Info */}
                <div className="p-10 text-center border-b border-slate-50 bg-slate-50/30">
                   <div className="w-24 h-24 mx-auto rounded-[32px] bg-brand-600 flex items-center justify-center text-3xl font-black text-white mb-6 border-4 border-white shadow-xl shadow-brand-500/20 overflow-hidden">
                      {user?.image ? (
                        <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user?.name || 'User')
                      )}
                   </div>
                   <h3 className="font-black text-xl text-slate-900 font-heading leading-tight">{user?.name || 'User'}</h3>
                   <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest mt-2">Member VIP 🌿</p>
                </div>

                {/* Nav Links */}
                <nav className="p-4">
                   <ul className="space-y-1.5">
                      {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                          <li key={link.href}>
                            <Link 
                              href={link.href}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                isActive 
                                  ? "bg-brand-600 text-white shadow-xl shadow-brand-500/20" 
                                  : "text-slate-500 hover:bg-brand-50 hover:text-brand-600"
                              )}
                            >
                               <div className="flex items-center gap-4">
                                  <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600 transition-colors")} />
                                  <span className="text-sm font-bold tracking-tight">{link.label}</span>
                               </div>
                               <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                            </Link>
                          </li>
                        )
                      })}
                      
                      {(user as any)?.role === 'admin' && (
                        <li className="pt-2">
                           <Link 
                             href="/admin"
                             className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all duration-300 group"
                           >
                              <div className="flex items-center gap-4">
                                 <ShieldCheck className="w-5 h-5 text-brand-400" />
                                 <span className="text-sm font-bold tracking-tight">Dashboard Admin</span>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </li>
                      )}

                      <li className="pt-6 mt-6 border-t border-slate-50">
                         <button 
                           onClick={() => signOut({ callbackUrl: '/' })}
                           className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all group"
                         >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="text-sm">Sign Out</span>
                         </button>
                      </li>
                   </ul>
                </nav>
             </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
             <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 lg:p-12 border border-slate-100 min-h-[600px]">
                {children}
             </div>
          </main>

        </div>
      </div>
    </div>
  )
}
