import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f766e' },
    { media: '(prefers-color-scheme: dark)', color: '#042f2e' },
  ],
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
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-white dark:bg-[#0a0f0d] antialiased`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16 lg:pt-[104px]">
              {children}
            </main>
            <Footer />
          </div>

          {/* Floating WhatsApp Bubble */}
          <a
            href="https://wa.me/62812118822"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-soft"
            aria-label="Chat WhatsApp"
          >
            <MessageCircle className="w-7 h-7 fill-current" />
          </a>
        </ThemeProvider>
      </body>
    </html>
  )
}
