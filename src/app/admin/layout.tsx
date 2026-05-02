'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Bell, 
  Search, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Bot,
  Zap,
  Globe,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const sidebarLinks = [
  { group: 'CORE', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/produk', label: 'Produk', icon: Package },
    { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingCart },
    { href: '/admin/pelanggan', label: 'Pelanggan', icon: Users },
  ]},
  { group: 'MARKETING COMMAND', items: [
    { href: '/admin/crm', label: 'CRM / Segmen', icon: TrendingUp },
    { href: '/admin/campaigns', label: 'WA & Email Blast', icon: Zap },
    { href: '/admin/pixel', label: 'Pixel Monitor', icon: BarChart3 },
    { href: '/admin/ai-tools', label: 'AI Copywriter', icon: Bot },
  ]},
  { group: 'SITE CONTENT', items: [
    { href: '/admin/artikel', label: 'Artikel / Blog', icon: Globe },
    { href: '/admin/media', label: 'Media Library', icon: Database },
  ]},
  { group: 'SYSTEM', items: [
    { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
  ]}
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060a08] flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#042f2e] text-white transition-all duration-500 flex flex-col shadow-2xl",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 relative">
           <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 bg-white rounded-xl flex items-center justify-center">
                 <span className="text-brand-900 text-lg font-bold">🌿</span>
              </div>
              {!isCollapsed && (
                <div className="whitespace-nowrap">
                   <h1 className="font-black font-heading text-lg leading-tight">Admin BSB</h1>
                   <p className="text-[10px] text-brand-300 font-bold uppercase tracking-widest">v2.0 Evolution</p>
                </div>
              )}
           </Link>
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="absolute -right-3 top-7 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center border-2 border-brand-900 hover:bg-brand-500 transition-colors shadow-lg"
           >
             {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
           </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-8 px-3 scrollbar-hide">
           {sidebarLinks.map((group, i) => (
             <div key={i} className="mb-8 last:mb-0">
                {!isCollapsed && (
                  <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4 px-4">
                    {group.group}
                  </p>
                )}
                <ul className="space-y-1">
                   {group.items.map((item) => {
                     const isActive = pathname === item.href
                     return (
                       <li key={item.href}>
                         <Link 
                           href={item.href}
                           className={cn(
                             "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                             isActive 
                               ? "bg-white/10 text-white shadow-xl shadow-black/10 border border-white/5" 
                               : "text-brand-200 hover:bg-white/5 hover:text-white"
                           )}
                         >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-brand-400" : "text-brand-400/60 group-hover:text-brand-400")} />
                            {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                            {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 bg-brand-400 rounded-full shadow-lg shadow-brand-400" />}
                         </Link>
                       </li>
                     )
                   })}
                </ul>
             </div>
           ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
           <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 font-bold hover:bg-red-950/30 transition-colors">
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-500",
        isCollapsed ? "pl-20" : "pl-72"
      )}>
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-[#060a08]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-6 max-w-xl w-full">
              <div className="relative w-full hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Cari pesanan, pelanggan, atau produk..."
                   className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none"
                 />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 transition-colors">
                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="h-8 w-px bg-gray-200 dark:bg-white/10" />
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Admin BSB</p>
                    <p className="text-[10px] text-gray-500">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-700/20">
                    AD
                 </div>
              </div>
           </div>
        </header>

        {/* Content Body */}
        <main className="p-8 lg:p-12">
           {children}
        </main>
      </div>
    </div>
  )
}
