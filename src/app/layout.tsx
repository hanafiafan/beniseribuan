import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { MainWrapper } from '@/components/layout/MainWrapper'
import LoginModal from '@/components/auth/LoginModal'
import CompareBar from '@/components/products/CompareBar'
import CartSyncer from '@/components/cart/CartSyncer'
import { MessageCircle } from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: {
    default: 'Benih Seribuan - Solusi Kebun Rumah Tangga',
    template: '%s | Benih Seribuan'
  },
  description: 'Ekosistem berkebun terlengkap untuk semua orang. Temukan benih sayuran, buah, bunga, herbal, pupuk, dan alat kebun berkualitas tinggi.',
  keywords: ['benih seribuan', 'bibit sayuran', 'pupuk organik', 'media tanam', 'alat kebun', 'berkebun di rumah', 'urban farming'],
  authors: [{ name: 'Benih Seribuan' }],
  creator: 'PT. Mutiara Benih Nusantara',
  publisher: 'PT. Mutiara Benih Nusantara',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased text-slate-900`}>
        <Providers>
          <MainWrapper>
            {children}
          </MainWrapper>
          <LoginModal />
          <CompareBar />
          <CartSyncer />
        </Providers>
      </body>
    </html>
  )
}
