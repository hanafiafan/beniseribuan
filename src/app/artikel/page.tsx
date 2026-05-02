'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Calendar, User, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  tags: string[]
  publishedAt: string | null
  createdAt: string
  author: { displayName: string } | null
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    fetch(`/api/articles?${params}`)
      .then(r => r.json())
      .then(d => { setArticles(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [query])

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="container-custom py-12">
      <header className="max-w-2xl mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 font-heading">
          Inspirasi & <span className="text-gradient-brand">Edukasi</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Pelajari teknik berkebun terbaru dan tips perawatan tanaman dari para ahli kami.
        </p>
      </header>

      {/* Search */}
      <div className="mb-12 max-w-xl">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setQuery(search)}
            placeholder="Cari artikel..."
            className="w-full pl-14 pr-5 py-4 bg-white border border-slate-100 rounded-2xl font-medium text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-brand-400 transition-all"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setQuery('') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-32 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-400 mx-auto" />
        </div>
      ) : articles.length === 0 ? (
        <div className="py-32 text-center space-y-4">
          <FileText className="w-16 h-16 text-slate-200 mx-auto" />
          <h2 className="text-2xl font-black text-slate-300">Belum Ada Artikel</h2>
          <p className="text-slate-400 font-medium">
            {query ? `Tidak ada hasil untuk "${query}"` : 'Artikel akan muncul di sini setelah dipublikasikan oleh admin.'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured Articles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {articles.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/artikel/${article.slug}`}>
                  <div className="relative h-64 rounded-[40px] overflow-hidden mb-6 bg-slate-100">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    {Array.isArray(article.tags) && article.tags[0] && (
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-brand-700 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                          {article.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-2">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.publishedAt || article.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author?.displayName || 'Admin Benih'}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight font-heading">
                      {article.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-black text-brand-600 uppercase tracking-widest group/link">
                      Baca Selengkapnya
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </>
      )}

      {/* Newsletter Glass Card */}
      <div className="glass-panel rounded-[48px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h3 className="text-2xl font-black text-slate-900 mb-2 font-heading">Dapatkan Tips Mingguan</h3>
          <p className="text-slate-500 font-medium">Berlangganan newsletter kami untuk tips eksklusif dan promo menarik langsung di email Anda.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input
            type="email"
            placeholder="Alamat email Anda"
            className="flex-1 md:w-80 px-6 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
          />
          <button className="px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-105 transition-all duration-300">
            Daftar
          </button>
        </div>
      </div>
    </div>
  )
}
