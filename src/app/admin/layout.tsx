'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
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
  Database,
  Leaf,
  Ticket,
  Crown,
  Coins,
  Clock3,
  Globe,
  ExternalLink,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  { group: 'GROWTH & PROMOTION', items: [
    { href: '/admin/promosi/kupon', label: 'Kupon & Voucher', icon: Ticket },
    { href: '/admin/promosi/flash-sale', label: 'Flash Sale', icon: Clock3 },
    { href: '/admin/membership', label: 'Membership Program', icon: Crown },
    { href: '/admin/points', label: 'Points / Loyalty', icon: Coins },
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-200 text-slate-600 transition-all duration-500 flex flex-col shadow-2xl lg:shadow-none",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 relative">
           <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                 <Leaf className="text-white w-6 h-6" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="whitespace-nowrap">
                   <h1 className="font-black font-heading text-slate-900 text-lg leading-none">Admin</h1>
                   <p className="text-[9px] text-brand-600 font-black uppercase tracking-widest mt-1">v2.0 Evolution</p>
                </div>
              )}
           </Link>
           
           {/* Collapse toggle (Desktop) */}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-brand-600 transition-all shadow-md z-10"
           >
             {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
           </button>

           {/* Close toggle (Mobile) */}
           <button 
             onClick={() => setIsMobileOpen(false)}
             className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400"
           >
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 scrollbar-hide">
           {sidebarLinks.map((group, i) => (
             <div key={i} className="mb-8 last:mb-0">
                {(!isCollapsed || isMobileOpen) && (
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">
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
                             "flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group",
                             isActive 
                               ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50" 
                               : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                           )}
                         >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-600 transition-colors")} />
                            {(!isCollapsed || isMobileOpen) && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                            {isActive && (!isCollapsed || isMobileOpen) && <div className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full" />}
                         </Link>
                       </li>
                     )
                   })}
                </ul>
             </div>
           ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
           <button className="flex items-center gap-4 w-full p-3.5 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-colors group">
              <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              {(!isCollapsed || isMobileOpen) && <span className="text-sm">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-500 min-w-0 w-full",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4 max-w-xl w-full">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                 <Menu className="w-6 h-6" />
              </button>

              <div className="relative w-full hidden sm:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Quick search..."
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none"
                 />
              </div>
           </div>

           <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/" 
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 rounded-xl text-[10px] sm:text-xs font-black hover:bg-brand-100 transition-all border border-brand-100 shadow-sm"
              >
                 <ExternalLink className="w-3.5 h-3.5" />
                 View Store
              </Link>
              <button className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                 <Bell className="w-5 h-5 text-slate-600" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-200 hidden xs:block" />
              <div className="flex items-center gap-2 sm:gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">Admin BSB</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-700/20 text-sm">
                    AD
                 </div>
              </div>
           </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
           <div className="max-w-7xl mx-auto w-full">
              {children}
           </div>
        </main>
      </div>
    </div>
  )
}
