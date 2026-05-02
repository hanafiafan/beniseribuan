'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex-grow ${isAdmin ? '' : 'pt-24 lg:pt-[116px]'}`}
      >
        {children}
      </motion.main>
      {!isAdmin && <Footer />}
      
      {!isAdmin && (
        <a
          href="https://wa.me/62812118822"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-soft"
          aria-label="Chat WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      )}
    </div>
  )
}
