'use client'
import { useState, useEffect, useRef } from 'react'
import { 
  Upload, Search, Image, FileText, Video, Filter, Trash2, 
  Copy, Download, Edit2, Check, Grid, List, Loader2, X, ImageOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

type MediaItem = {
  id: number; fileName: string; fileUrl: string; fileType: string;
  fileSize: number; alt: string; createdAt: string;
  uploader: { displayName: string }
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<number[]>([])
  const [uploading, setUploading] = useState(false)
  const [editItem, setEditItem] = useState<MediaItem | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchMedia = () => {
    const params = new URLSearchParams()
    if (filterType) params.set('type', filterType)
    fetch(`/api/admin/media?${params}`)
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
  }

  useEffect(() => { fetchMedia() }, [filterType])

  const filtered = items.filter(m =>
    !search || m.fileName.toLowerCase().includes(search.toLowerCase()) || m.alt?.toLowerCase().includes(search.toLowerCase())
  )

  const handleUploadFiles = async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      // For demo: create an object URL for preview and record to DB
      // In production, upload to Cloudinary first then save URL
      const objectUrl = URL.createObjectURL(file)
      await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: objectUrl,
          fileType: file.type,
          fileSize: file.size,
          alt: file.name.replace(/\.[^/.]+$/, '')
        })
      })
    }
    setUploading(false)
    setLoading(true)
    fetchMedia()
  }

  const handleDelete = async (ids: number[]) => {
    if (!confirm(`Hapus ${ids.length} file?`)) return
    for (const id of ids) {
      await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    }
    setItems(i => i.filter(m => !ids.includes(m.id)))
    setSelected([])
  }

  const handleCopy = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSaveAlt = async () => {
    if (!editItem) return
    await fetch('/api/admin/media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editItem.id, alt: editAlt }) })
    setItems(i => i.map(m => m.id === editItem.id ? { ...m, alt: editAlt } : m))
    setEditItem(null)
  }

  const toggleSelect = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const totalSize = items.reduce((sum, m) => sum + (m.fileSize || 0), 0)
  const images = items.filter(m => m.fileType?.startsWith('image/')).length
  const docs = items.filter(m => m.fileType?.includes('pdf') || m.fileType?.includes('document')).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">Media Library</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola semua file gambar dan media platform.</p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button onClick={() => handleDelete(selected)} className="flex items-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all border border-red-100">
              <Trash2 className="w-4 h-4" /> Hapus ({selected.length})
            </button>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-3 px-8 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? 'Mengupload...' : 'Upload File'}
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={e => e.target.files && handleUploadFiles(e.target.files)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {[
          { label: 'Total File', val: items.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Gambar', val: images, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Dokumen', val: docs, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Ukuran', val: formatBytes(totalSize), color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={cn("p-6 rounded-3xl border border-slate-100 shadow-sm", bg)}>
            <p className={cn("text-3xl font-black", color)}>{val}</p>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Drag & Drop Zone */}
      <div
        className="mx-6 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer group"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); e.dataTransfer.files && handleUploadFiles(e.dataTransfer.files) }}
      >
        <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
        <p className="font-black text-slate-500 group-hover:text-brand-600 transition-colors">Drag & Drop file ke sini atau klik untuk pilih</p>
        <p className="text-xs text-slate-400 mt-1">Mendukung: JPG, PNG, WebP, SVG, GIF, PDF, MP4 (max 50MB)</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 px-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama file atau alt text..." className="w-full pl-11 pr-5 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-900 text-sm shadow-sm outline-none" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 shadow-sm">
          <option value="">Semua Tipe</option>
          <option value="image/">Gambar</option>
          <option value="video/">Video</option>
          <option value="application/">Dokumen</option>
        </select>
        <div className="flex gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          <button onClick={() => setViewMode('grid')} className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-700')}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-700')}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Grid / List */}
      <div className="px-6">
        {loading ? (
          <div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <ImageOff className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-400 font-bold">Belum ada media</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(item => {
              const isImage = item.fileType?.startsWith('image/')
              const isSelected = selected.includes(item.id)
              return (
                <div key={item.id} onClick={() => toggleSelect(item.id)} className={cn(
                  "relative rounded-2xl overflow-hidden group cursor-pointer border-2 transition-all",
                  isSelected ? "border-brand-500 shadow-lg shadow-brand-500/20" : "border-transparent hover:border-slate-200"
                )}>
                  <div className="aspect-square bg-slate-100">
                    {isImage ? (
                      <img src={item.fileUrl} alt={item.alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end opacity-0 group-hover:opacity-100">
                    <div className="p-3 w-full flex gap-2">
                      <button onClick={e => { e.stopPropagation(); handleCopy(item.fileUrl, item.id) }} className="flex-1 py-2 bg-white/90 rounded-xl text-[10px] font-black text-slate-700 hover:bg-white transition-colors flex items-center justify-center gap-1">
                        {copied === item.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} URL
                      </button>
                      <button onClick={e => { e.stopPropagation(); setEditItem(item); setEditAlt(item.alt || '') }} className="p-2 bg-white/90 rounded-xl text-slate-700 hover:bg-white transition-colors">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete([item.id]) }} className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="px-2 py-2 bg-white">
                    <p className="text-[10px] font-bold text-slate-600 truncate">{item.fileName}</p>
                    <p className="text-[9px] text-slate-400">{formatBytes(item.fileSize)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {filtered.map(item => {
                const isImage = item.fileType?.startsWith('image/')
                return (
                  <div key={item.id} className="flex items-center gap-5 px-8 py-5 group hover:bg-slate-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {isImage ? <img src={item.fileUrl} alt={item.alt} className="w-full h-full object-cover" /> : <FileText className="w-6 h-6 text-slate-300 m-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.fileName}</p>
                      <p className="text-xs text-slate-400">{item.alt || '-'} · {formatBytes(item.fileSize)} · {item.fileType}</p>
                    </div>
                    <p className="text-xs text-slate-400 hidden md:block shrink-0">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleCopy(item.fileUrl, item.id)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-600 shadow-sm transition-all">
                        {copied === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditItem(item); setEditAlt(item.alt || '') }} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete([item.id])} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Alt Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Edit Info Media</h2>
              <button onClick={() => setEditItem(null)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {editItem.fileType?.startsWith('image/') && (
              <img src={editItem.fileUrl} alt={editItem.alt} className="w-full h-48 object-cover rounded-2xl" />
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alt Text (SEO)</label>
              <input value={editAlt} onChange={e => setEditAlt(e.target.value)} placeholder="Deskripsi gambar untuk aksesibilitas..." className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL File</label>
              <div className="flex gap-2">
                <input value={editItem.fileUrl} readOnly className="flex-1 px-4 py-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-500" />
                <button onClick={() => handleCopy(editItem.fileUrl, editItem.id)} className="px-4 py-3 bg-brand-50 text-brand-600 rounded-xl font-black text-xs hover:bg-brand-100">
                  {copied === editItem.id ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditItem(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-600">Batal</button>
              <button onClick={handleSaveAlt} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-black hover:bg-brand-700">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
