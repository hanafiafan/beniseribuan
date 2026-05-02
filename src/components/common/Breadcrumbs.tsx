'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  // Skip breadcrumbs on homepage
  if (pathname === '/') return null
  
  const paths = pathname.split('/').filter(Boolean)
  
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    const label = path
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())
    
    return { href, label }
  })

  return (
    <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap py-1 no-scrollbar">
      <Link 
        href="/" 
        className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
      >
        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Beranda</span>
      </Link>
      
      {breadcrumbs.map((crumb, i) => {
        const isLast = i === breadcrumbs.length - 1
        
        return (
          <div key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-black truncate max-w-[150px] sm:max-w-none">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href}
                className="hover:text-brand-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
