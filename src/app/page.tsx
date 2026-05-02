import { HeroSection } from '@/components/home/HeroSection'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { StorytellingBanner } from '@/components/home/StorytellingBanner'
import { Users, Sprout, Map, Award } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col pb-24">
      <HeroSection />
      
      <div className="mt-24">
        <CategorySection />
      </div>

      <div className="mt-24">
        <FeaturedProducts />
      </div>

      <div className="mt-12">
        <StorytellingBanner />
      </div>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {[
            { icon: Users, value: '5.601+', label: 'Pelanggan Senang' },
            { icon: Sprout, value: '35.000+', label: 'Benih Terjual' },
            { icon: Award, value: '140+', label: 'Variasi Benih' },
            { icon: Map, value: '34', label: 'Provinsi Terjangkau' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-700 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 font-heading">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safe Shopping Flow Placeholder */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-16 font-heading">
          Belanja Aman & <span className="text-gradient-brand">Nyaman</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Pilih Benih', desc: 'Pilih dari ratusan varian benih unggulan kami.' },
            { step: '02', title: 'Bayar Mudah', desc: 'Berbagai pilihan pembayaran instan & otomatis.' },
            { step: '03', title: 'Terima Paket', desc: 'Pengiriman cepat langsung ke depan pintu Anda.' },
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-[40px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500">
              <span className="absolute top-8 right-8 text-5xl font-black text-brand-50 dark:text-brand-900/20">
                {item.step}
              </span>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h4>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
