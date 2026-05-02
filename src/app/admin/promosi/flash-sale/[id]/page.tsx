'use client'
import { useState, useEffect, useRef, use } from 'react'
import { ArrowLeft, Save, Plus, Trash2, Search, Package, Zap, Loader2, Calendar, Clock, Image as ImageIcon, Upload, Percent, Sparkles, TrendingDown, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRupiah, cn } from '@/lib/utils'

interface Product {
  id: number
  name: string
  price: string
  stock: number
  images: { url: string }[]
}

interface FlashProduct {
  productId: number
  flashPrice: string
  stock: number
  product: Product
  discountPercent: number
  soldCount?: number
}

export default function EditFlashSalePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const bannerRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  
  // Form State
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  
  // Product Selection
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<FlashProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Fetch Data
  useEffect(() => {
    fetch(`/api/admin/flash-sale/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
          router.push('/admin/promosi/flash-sale')
          return
        }
        setName(data.name)
        setStartDate(data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '')
        setEndDate(data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '')
        setDescription(data.description || '')
        setBannerPreview(data.image || null)
        
        // Map products
        if (data.products) {
          setSelectedProducts(data.products.map((p: any) => ({
            productId: p.productId,
            flashPrice: p.flashPrice,
            stock: p.stock,
            soldCount: p.soldCount,
            product: p.product,
            discountPercent: Math.round(((Number(p.product.price) - Number(p.flashPrice)) / Number(p.product.price)) * 100)
          })))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delay = setTimeout(() => {
        setIsSearching(true)
        fetch(`/api/search?q=${searchQuery}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(Array.isArray(data) ? data : [])
            setIsSearching(false)
          })
      }, 500)
      return () => clearTimeout(delay)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const calculateDiscount = (original: string, flash: string) => {
    const orig = Number(original)
    const fl = Number(flash)
    if (orig <= 0) return 0
    return Math.round(((orig - fl) / orig) * 100)
  }

  const addProduct = (product: Product) => {
    if (selectedProducts.find(p => p.productId === product.id)) return
    const defaultFlashPrice = (Number(product.price) * 0.5).toString()
    setSelectedProducts([...selectedProducts, {
      productId: product.id,
      flashPrice: defaultFlashPrice,
      stock: Math.min(product.stock, 10),
      product,
      discountPercent: 50
    }])
    setSearchQuery('')
    setSearchResults([])
  }

  const applyGlobalDiscount = (percent: number) => {
    setSelectedProducts(selectedProducts.map(p => {
      const newPrice = Math.round(Number(p.product.price) * (1 - percent / 100)).toString()
      return { ...p, flashPrice: newPrice, discountPercent: percent }
    }))
  }

  const removeProduct = (id: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== id))
  }

  const updateProductData = (id: number, field: keyof FlashProduct, value: any) => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.productId === id) {
        const updated = { ...p, [field]: value }
        if (field === 'flashPrice') {
          updated.discountPercent = calculateDiscount(p.product.price, value as string)
        }
        return updated
      }
      return p
    }))
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  // Date Helpers
  const formatForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const setStartPreset = (type: 'now' | 'tonight' | 'tomorrow') => {
    const date = new Date();
    if (type === 'tonight') {
      date.setHours(19, 0, 0, 0);
    } else if (type === 'tomorrow') {
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
    }
    setStartDate(formatForInput(date));
  }

  const setEndPreset = (hours: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const date = new Date(base.getTime() + hours * 60 * 60 * 1000);
    setEndDate(formatForInput(date));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProducts.length === 0) {
      alert("Pilih minimal satu produk!")
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/flash-sale/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          description,
          image: bannerPreview, 
          products: selectedProducts.map(p => ({
            productId: p.productId,
            flashPrice: p.flashPrice,
            stock: p.stock,
            soldCount: p.soldCount || 0
          }))
        })
      })

      if (res.ok) {
        router.push('/admin/promosi/flash-sale')
      } else {
        const data = await res.json()
        alert(data.error || "Gagal memperbarui flash sale")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan sistem")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-300">
         <Loader2 className="w-12 h-12 animate-spin" />
         <p className="text-xs font-black uppercase tracking-widest">Loading Campaign Data...</p>
      </div>
    )
  }

  return (
    <div className="pb-32 px-4 sm:px-0">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 mt-6 sm:mt-0">
        <div className="flex items-center gap-5">
          <Link 
            href="/admin/promosi/flash-sale" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-600 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">Edit Campaign</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Edit and update your existing flash sale.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-amber-400" />}
          {saving ? 'Updating...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Basic Info */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                   <Zap className="w-4 h-4 fill-current" />
                </div>
                <h3 className="text-lg font-black text-slate-900 font-heading">Event Details</h3>
             </div>
             <div className="p-6 sm:p-8 space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Name</label>
                   <input 
                     type="text" 
                     value={name}
                     onChange={e => setName(e.target.value)}
                     placeholder="Contoh: Super Flash 12.12"
                     className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Start Date */}
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-700" 
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <button onClick={() => setStartPreset('now')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">Now</button>
                         <button onClick={() => setStartPreset('tonight')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">Tonight (19:00)</button>
                         <button onClick={() => setStartPreset('tomorrow')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">Tomorrow (09:00)</button>
                      </div>
                   </div>

                   {/* End Date */}
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-700" 
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <button onClick={() => setEndPreset(2)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors">+2h</button>
                         <button onClick={() => setEndPreset(6)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors">+6h</button>
                         <button onClick={() => setEndPreset(24)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors">+1 Day</button>
                         <button onClick={() => setEndPreset(72)} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors">+3 Days</button>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                   <textarea 
                     rows={3}
                     value={description}
                     onChange={e => setDescription(e.target.value)}
                     placeholder="Berikan keterangan singkat tentang promo ini..."
                     className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-slate-600 resize-none focus:ring-2 focus:ring-brand-500 outline-none" 
                   />
                </div>
             </div>
          </div>

          {/* Card 2: Product Selection */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h3 className="text-lg font-black text-slate-900 font-heading">Promoted Products</h3>
                <div className="relative w-full sm:w-72 group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Cari produk..."
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-sm border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-medium" 
                   />
                   {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 animate-spin" />}
                   
                   {searchResults.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                        {searchResults.map(p => (
                          <button 
                            key={p.id}
                            type="button"
                            onClick={() => addProduct(p)}
                            className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-all text-left group/item border-b border-slate-50 last:border-0"
                          >
                             <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                <img src={p.images?.[0]?.url || '/images/placeholder.png'} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                                <p className="text-xs text-slate-400 font-bold">{formatRupiah(Number(p.price))}</p>
                             </div>
                             <Plus className="w-4 h-4 text-slate-300 group-hover/item:text-brand-500" />
                          </button>
                        ))}
                     </div>
                   )}
                </div>
             </div>

             <div className="p-6 sm:p-8 space-y-6">
                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <TrendingDown className="w-4 h-4 text-slate-400" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Apply Bulk Discount:</span>
                     <div className="flex gap-2">
                        {[10, 25, 50, 75].map(p => (
                          <button 
                            key={p}
                            type="button"
                            onClick={() => applyGlobalDiscount(p)}
                            className="px-3 py-1.5 bg-white text-slate-900 text-xs font-black rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200"
                          >
                            {p}%
                          </button>
                        ))}
                     </div>
                  </div>
                )}

                <div className="space-y-4">
                   {selectedProducts.length === 0 ? (
                     <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-sm">Belum ada produk yang dipilih.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 gap-4">
                        {selectedProducts.map(p => (
                          <div key={p.productId} className="p-5 sm:p-6 bg-slate-50/50 hover:bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 group/card">
                             <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Product Info Block */}
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                   <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm">
                                      <img src={p.product.images?.[0]?.url || '/images/placeholder.png'} className="w-full h-full object-cover" />
                                   </div>
                                   <div className="min-w-0 flex-1">
                                      <h4 className="font-black text-slate-900 truncate text-base sm:text-lg mb-1">{p.product.name}</h4>
                                      <div className="flex items-center gap-2">
                                         <span className="text-xs font-bold text-slate-400 line-through">{formatRupiah(Number(p.product.price))}</span>
                                         <ChevronRight className="w-3 h-3 text-slate-300" />
                                         <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">Rp {formatRupiah(Number(p.flashPrice))}</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Inputs Block */}
                                <div className="grid grid-cols-2 xs:flex items-end gap-5 sm:gap-6 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100/50">
                                   <div className="space-y-1.5 flex-1">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flash Price</label>
                                      <div className="relative">
                                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Rp</span>
                                         <input 
                                           type="number" 
                                           value={p.flashPrice}
                                           onChange={e => updateProductData(p.productId, 'flashPrice', e.target.value)}
                                           className="w-full md:w-32 pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-black text-slate-900 text-sm" 
                                         />
                                      </div>
                                   </div>
                                   
                                   <div className="space-y-1.5 w-full xs:w-20">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Promo Stock</label>
                                      <input 
                                         type="number" 
                                         value={p.stock}
                                         max={p.product.stock}
                                         onChange={e => updateProductData(p.productId, 'stock', Number(e.target.value))}
                                         className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-black text-center text-sm" 
                                      />
                                   </div>

                                   <div className="hidden xs:flex flex-col items-center gap-1.5">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disc</label>
                                      <div className="w-14 py-3 bg-amber-500 text-slate-950 rounded-xl font-black text-center text-sm">
                                         {p.discountPercent}%
                                      </div>
                                   </div>

                                   <button 
                                     onClick={() => removeProduct(p.productId)}
                                     className="w-12 h-12 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover/card:opacity-100 md:opacity-0"
                                   >
                                      <Trash2 className="w-5 h-5" />
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Preview & Extras */}
        <div className="space-y-8">
           {/* Card 3: Media */}
           <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-black text-slate-900 font-heading flex items-center gap-3">
                 <ImageIcon className="w-5 h-5 text-brand-600" />
                 Campaign Media
              </h3>
              
              <div 
                onClick={() => bannerRef.current?.click()}
                className={cn(
                  "relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                  bannerPreview ? "border-brand-500" : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                )}
              >
                 {bannerPreview ? (
                   <>
                     <img src={bannerPreview} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); setBannerPreview(null) }}
                        className="absolute top-4 right-4 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                   </>
                 ) : (
                   <>
                     <Upload className="w-8 h-8 text-slate-300 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload banner</p>
                   </>
                 )}
                 <input type="file" ref={bannerRef} className="hidden" onChange={handleBannerUpload} accept="image/*" />
              </div>
           </div>

           {/* Card 4: Preview Card */}
           <div className="bg-slate-900 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full" />
              <h3 className="text-lg font-black text-white font-heading relative flex items-center gap-2">
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                 Live Preview
              </h3>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Live Flash Sale</span>
                    <div className="flex gap-1">
                       <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-black text-white">00</div>
                       <div className="text-white text-[10px]">:</div>
                       <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-black text-white">00</div>
                    </div>
                 </div>
                 
                 <h4 className="text-white font-black text-lg leading-tight truncate">{name || 'Event Title'}</h4>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Selected Items</span>
                    <span className="text-xs font-black text-amber-500">{selectedProducts.length} Products</span>
                 </div>
              </div>

              <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-2xl flex gap-3">
                 <Percent className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                 <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                    Tips: Gunakan diskon minimal 30% untuk menarik minat pembeli secara instan.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
