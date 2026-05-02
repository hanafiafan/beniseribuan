'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf } from 'lucide-react'

interface AuthShellProps {
  children: React.ReactNode
  title: string
  subtitle: string
  image: string
}

export function AuthShell({ children, title, subtitle, image }: AuthShellProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Brand Side */}
      <div className="hidden lg:block relative overflow-hidden bg-brand-900 p-20">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-400 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leaf-400 rounded-full blur-[100px] -ml-24 -mb-24" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 mb-24 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-brand-900 text-lg font-bold">🌿</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-heading leading-tight">Benih Seribuan</h1>
            <p className="text-[10px] text-brand-300 font-bold uppercase tracking-widest">Solusi Kebun Rumah</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-white leading-tight mb-8 font-heading">
              {title}
            </h2>
            <p className="text-xl text-brand-200 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-20 right-20 z-10 flex items-center justify-between">
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-900 bg-brand-700" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-brand-900 bg-white flex items-center justify-center text-[10px] font-bold text-brand-900">
                5K+
              </div>
           </div>
           <p className="text-xs font-bold text-brand-300 uppercase tracking-widest">Bergabung dengan 5.601+ Pekebun</p>
        </div>
        
        {/* Background Decorative Image */}
        <div className="absolute bottom-0 right-0 w-[80%] h-[60%] pointer-events-none opacity-40">
           <Image src={image} alt="Botanical Pattern" fill className="object-contain object-right-bottom" />
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center px-6 lg:px-24 py-12 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 p-2 rounded-full bg-gray-50 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="max-w-md w-full mx-auto">
          {children}
        </div>

        <p className="mt-12 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Benih Seribuan. Keamanan data Anda adalah prioritas kami.
        </p>
      </div>
    </div>
  )
}
