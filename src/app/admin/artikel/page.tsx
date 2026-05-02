'use client'
import { useState, useEffect } from 'react'
import { 
  Plus, Search, Filter, Edit2, Trash2, Eye, Globe, FileText, 
  Clock, CheckCircle, Archive, Tag, User, Calendar, Loader2, X, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'draft' | 'published' | 'archived'
type Article = {
  id: number; title: string; slug: string; status: Status;
  publishedAt: string | null; createdAt: string; excerpt: string;
  featuredImage: string; tags: string[]; author: { displayName: string; email: string }
}

const statusConfig = {
  published: { label: 'Published', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  archived: { label: 'Arsip', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Archive },
}

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState<Article | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', tags: '', status: 'draft' as Status })

  const fetchArticles = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    fetch(`/api/admin/articles?${params}`)
      .then(r => r.json())
      .then(d => { setArticles(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { 
    const delay = setTimeout(fetchArticles, 300)
    return () => clearTimeout(delay)
  }, [search, filterStatus])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', tags: '', status: 'draft' })
    setShowEditor(true)
  }

  const openEdit = (a: Article) => {
    setEditTarget(a)
    setForm({
      title: a.title, slug: a.slug, excerpt: a.excerpt || '',
      content: '', featuredImage: a.featuredImage || '',
      tags: Array.isArray(a.tags) ? a.tags.join(', ') : '',
      status: a.status
    })
    setShowEditor(true)
  }

  const handleSave = async () => {
    if (!form.title) return
    setSaving(true)
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const method = editTarget ? 'PUT' : 'POST'
    const body = editTarget ? { ...payload, id: editTarget.id } : payload
    try {
      await fetch('/api/admin/articles', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setShowEditor(false)
      fetchArticles()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus artikel ini?')) return
    await fetch('/api/admin/articles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setArticles(a => a.filter(x => x.id !== id))
  }

  const setSlug = (title: string) => {
    setForm(f => ({ ...f, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
  }

  const counts = {
    all: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  }

  return (
    <div className="pb-24 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">Article & Content</h1>
           <p className="text-sm text-slate-500 font-medium mt-1">Kelola publikasi edukasi dan berita terbaru toko Anda.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-600/10 hover:bg-brand-700 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', val: counts.all, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Published', val: counts.published, color: 'text-emerald-600', bg: 'bg-white border-emerald-100' },
          { label: 'Drafts', val: counts.draft, color: 'text-amber-600', bg: 'bg-white border-amber-100' },
          { label: 'Archived', val: counts.archived, color: 'text-slate-400', bg: 'bg-white border-slate-100' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={cn("p-6 rounded-[28px] border shadow-sm", bg)}>
            <p className={cn("text-2xl sm:text-3xl font-black font-heading", color)}>{val}</p>
            <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search articles..." 
            className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
          />
        </div>
        <div className="flex gap-4">
           <select 
             value={filterStatus} 
             onChange={e => setFilterStatus(e.target.value)} 
             className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-brand-500 text-sm"
           >
             <option value="">All Status</option>
             <option value="published">Published</option>
             <option value="draft">Draft</option>
             <option value="archived">Archived</option>
           </select>
           <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand-600 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* List Content */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center space-y-4">
             <Loader2 className="w-10 h-10 animate-spin text-brand-400 mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Synchronizing Contents...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm mb-6">Start building your audience by creating your first blog post.</p>
            <button onClick={openCreate} className="px-8 py-3.5 bg-brand-600 text-white rounded-xl font-black text-xs shadow-lg shadow-brand-600/20">Write First Post</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {articles.map(article => {
              const sc = statusConfig[article.status]
              const StatusIcon = sc.icon
              return (
                <div key={article.id} className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-all group">
                   {/* Thumbnail */}
                   <div className="w-full md:w-32 lg:w-40 aspect-video md:aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                      {article.featuredImage ? (
                        <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                           <FileText className="w-10 h-10 text-slate-200" />
                        </div>
                      )}
                   </div>

                   {/* Article Info */}
                   <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="space-y-3">
                         <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", sc.color)}>
                               <StatusIcon className="w-3 h-3" /> {sc.label}
                            </span>
                            {Array.isArray(article.tags) && article.tags.slice(0, 2).map(t => (
                              <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {t}
                              </span>
                            ))}
                         </div>
                         <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight group-hover:text-brand-700 transition-colors">{article.title}</h3>
                         <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-2 max-w-2xl">{article.excerpt}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-5 mt-5">
                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[8px] uppercase">{article.author?.displayName?.[0] || 'A'}</div>
                            {article.author?.displayName || 'Admin'}
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </div>
                         <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-300 font-mono italic">
                            /blog/{article.slug}
                         </div>
                      </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex md:flex-col items-center justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-600 shadow-sm transition-all flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => openEdit(article)} className="flex-1 md:flex-none p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="flex-1 md:flex-none p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modern Modal Editor */}
      {showEditor && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                    <FileText className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl sm:text-2xl font-black text-slate-900">{editTarget ? 'Edit Article' : 'Write New Article'}</h2>
              </div>
              <button onClick={() => setShowEditor(false)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Title *</label>
                      <input value={form.title} onChange={e => setSlug(e.target.value)} placeholder="e.g. 10 Cara Merawat Benih..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 text-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Slug URL</label>
                      <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus-within:border-brand-100 transition-all">
                        <span className="text-slate-400 text-sm font-bold">/blog/</span>
                        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="flex-1 bg-transparent border-none font-mono text-sm text-slate-700 outline-none font-bold" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Excerpt / Summary</label>
                      <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={4} placeholder="Brief summary for list views..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-900 resize-none text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Featured Image URL</label>
                      <div className="flex flex-col gap-4">
                        <input value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        <div className="aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 overflow-hidden flex items-center justify-center relative group">
                           {form.featuredImage ? (
                             <img src={form.featuredImage} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="text-center">
                                <Globe className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Image Preview</p>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                      <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tips, gardening, seeds" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Content (Markdown Support)</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={15} placeholder="Write your story here..." className="w-full px-8 py-6 bg-slate-50 rounded-[32px] border-none font-medium text-slate-900 resize-none font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 flex-shrink-0">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 hidden sm:block">Status:</div>
                 <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
                   <option value="draft">💾 Draft</option>
                   <option value="published">🚀 Published</option>
                   <option value="archived">📦 Archived</option>
                 </select>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button onClick={() => setShowEditor(false)} className="flex-1 sm:flex-none px-8 py-3 bg-white border border-slate-200 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-colors shadow-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-3 bg-brand-600 text-white rounded-xl font-black hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : editTarget ? 'Update' : 'Post Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Save(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  )
}
