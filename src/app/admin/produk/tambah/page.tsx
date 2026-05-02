'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, ChevronRight, X, Upload, Scale, Hash, Tag, Globe, Settings2, Percent, Search, Layout, Video, Box, Layers, ListChecks, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Variant {
  name: string
  price: string
  salePrice: string
  stock: string
  weight: string
  sku: string
  image: string | null
}

interface Spec {
  label: string
  value: string
}

export default function AddProductPage() {
  const router = useRouter()
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [mainImages, setMainImages] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [hasVariants, setHasVariants] = useState(false)
  const [specs, setSpecs] = useState<Spec[]>([{ label: 'Daya Tumbuh', value: '95%' }, { label: 'Kemurnian', value: '98%' }])

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [stock, setStock] = useState('')
  const [weight, setWeight] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('Benih Seribuan')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isDigital, setIsDigital] = useState(false)

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setMainImages(prev => [...prev, ...newImages])
    }
  }

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const newVariants = [...variants]
      newVariants[index].image = imageUrl
      setVariants(newVariants)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', salePrice: '', stock: '', weight: '', sku: '', image: null }])
  }

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          shortDescription,
          price,
          salePrice,
          stock,
          weight,
          categoryId,
          images: mainImages,
          specs,
          brand,
          isFeatured,
          isDigital
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save product')
      }
      
      router.push('/admin/produk')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Gagal menyimpan produk. Pastikan database terhubung.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl pb-24 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-6">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/produk" 
            className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-600 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 font-heading tracking-tight">Tambah Produk Ultimate</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
               <Globe className="w-4 h-4 text-brand-500" />
               Enterprise-grade product management system.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all">Preview Store</button>
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="flex items-center gap-3 px-10 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50 btn-shimmer"
           >
             <Save className="w-5 h-5" />
             {loading ? 'Processing...' : 'Publish to Store'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section 1: General & Content */}
          <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-10">
            <h3 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-black">01</span>
              Informasi Produk
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Produk</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Benih Cabai Rawit Unggul 2024" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900 text-lg" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">URL Slug (SEO)</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4">
                       <span className="text-slate-400 text-sm font-medium mr-1">/produk/</span>
                       <input 
                         type="text" 
                         placeholder="benih-cabai-rawit" 
                         value={slug}
                         onChange={(e) => setSlug(e.target.value)}
                         className="bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-600 w-full p-0" 
                       />
                    </div>
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Singkat (SEO Description)</label>
                <textarea 
                  rows={2} 
                  placeholder="Summary untuk meta description & ringkasan produk..." 
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-medium text-slate-600 resize-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Lengkap (Product Story)</label>
                <div className="border border-slate-100 rounded-3xl overflow-hidden">
                   <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex gap-4 text-slate-400">
                      <span className="font-bold text-xs">B</span> <span className="italic text-xs">I</span> <span className="underline text-xs">U</span>
                   </div>
                   <textarea 
                     rows={10} 
                     placeholder="Jelaskan detail produk Anda di sini..." 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full px-6 py-6 bg-white border-none focus:ring-0 outline-none resize-none font-medium text-slate-600" 
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Specifications (Dynamic Attributes) */}
          <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-10">
            <h3 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-black">02</span>
              Spesifikasi Produk
            </h3>
            <div className="space-y-6">
            <div className="space-y-4">
               {specs.map((spec, i) => (
                 <div key={i} className="flex flex-col sm:flex-row gap-4 p-6 bg-slate-50 rounded-[24px] animate-in fade-in slide-in-from-left-4">
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Label / Nama Atribut</label>
                       <input 
                         type="text" 
                         placeholder="Contoh: Daya Tumbuh" 
                         value={spec.label}
                         onChange={(e) => { const ns = [...specs]; ns[i].label = e.target.value; setSpecs(ns) }}
                         className="w-full px-5 py-3 bg-white rounded-xl border-none font-bold text-slate-900 text-sm shadow-sm" 
                       />
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nilai / Value</label>
                       <input 
                         type="text" 
                         placeholder="Contoh: 95%" 
                         value={spec.value}
                         onChange={(e) => { const ns = [...specs]; ns[i].value = e.target.value; setSpecs(ns) }}
                         className="w-full px-5 py-3 bg-white rounded-xl border-none font-medium text-slate-600 text-sm shadow-sm" 
                       />
                    </div>
                    <button 
                      onClick={() => removeSpec(i)} 
                      className="sm:mt-7 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}
            </div>
               <button onClick={addSpec} className="inline-flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest hover:underline px-2 py-1">
                  <Plus className="w-4 h-4" /> Tambah Atribut Baru
               </button>
            </div>
          </div>

          {/* Section 3: Pricing & Advanced Shipping */}
          <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">03</span>
                  Pricing & Pengiriman
                </h3>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
                   <button onClick={() => setHasVariants(false)} className={cn("px-6 py-2.5 text-xs font-black rounded-xl transition-all", !hasVariants ? "bg-white shadow-md text-brand-600" : "text-slate-400")}>SINGLE</button>
                   <button onClick={() => setHasVariants(true)} className={cn("px-6 py-2.5 text-xs font-black rounded-xl transition-all", hasVariants ? "bg-white shadow-md text-brand-600" : "text-slate-400")}>VARIANT</button>
                </div>
             </div>

             {!hasVariants ? (
               <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Normal (Rp)</label>
                       <input 
                         type="number" 
                         placeholder="0" 
                         value={price}
                         onChange={(e) => setPrice(e.target.value)}
                         className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-black text-slate-900" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2"><Percent className="w-3 h-3" /> Harga Diskon</label>
                       <input 
                         type="number" 
                         placeholder="0" 
                         value={salePrice}
                         onChange={(e) => setSalePrice(e.target.value)}
                         className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl border-none focus:ring-2 focus:ring-red-500 outline-none font-black" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Produk</label>
                       <input type="text" placeholder="BSB-MASTER" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900" />
                    </div>
                 </div>
                 
                 <div className="pt-10 border-t border-slate-50 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Scale className="w-3 h-3" /> Berat (Gram)</label>
                       <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> Panjang (cm)</label>
                       <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> Lebar (cm)</label>
                       <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> Tinggi (cm)</label>
                       <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                    </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-6">
                     {variants.map((variant, index) => (
                       <div key={index} className="p-8 bg-slate-50 rounded-[48px] relative border border-transparent hover:border-brand-200 transition-all hover:shadow-xl hover:shadow-black/5">
                          <div className="flex flex-col md:flex-row gap-8">
                             <div className="shrink-0 flex flex-col items-center gap-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto Varian</label>
                                <div onClick={() => document.getElementById(`variant-img-${index}`)?.click()} className="w-28 h-28 rounded-[32px] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-500 hover:text-brand-600 transition-all cursor-pointer overflow-hidden relative group">
                                   {variant.image ? (
                                      <>
                                         <img src={variant.image} className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Upload className="w-6 h-6 text-white" /></div>
                                      </>
                                   ) : (
                                      <><ImageIcon className="w-8 h-8 mb-1" /><span className="text-[8px] font-black">UPLOAD</span></>
                                   )}
                                </div>
                                <input id={`variant-img-${index}`} type="file" className="hidden" onChange={(e) => handleVariantImageUpload(index, e)} />
                             </div>
                             
                             <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama / Ukuran</label>
                                      <input type="text" value={variant.name} onChange={(e) => { const nv = [...variants]; nv[index].name = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Varian</label>
                                      <input type="text" value={variant.sku} onChange={(e) => { const nv = [...variants]; nv[index].sku = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold text-brand-600" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat (gr)</label>
                                      <input type="number" value={variant.weight} onChange={(e) => { const nv = [...variants]; nv[index].weight = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-white rounded-xl border-none font-black" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Normal</label>
                                      <input type="number" value={variant.price} onChange={(e) => { const nv = [...variants]; nv[index].price = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-red-400 uppercase tracking-widest">Harga Diskon</label>
                                      <input type="number" value={variant.salePrice} onChange={(e) => { const nv = [...variants]; nv[index].salePrice = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl border-none font-black" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stok Ready</label>
                                      <input type="number" value={variant.stock} onChange={(e) => { const nv = [...variants]; nv[index].stock = e.target.value; setVariants(nv) }} className="w-full px-4 py-3 bg-white rounded-xl border-none font-black" />
                                   </div>
                                </div>
                             </div>
                          </div>
                          <button onClick={() => removeVariant(index)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-6 h-6" /></button>
                       </div>
                     ))}
                  </div>
                  <button onClick={addVariant} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[48px] text-slate-400 font-black text-sm flex items-center justify-center gap-3 hover:border-brand-500 hover:text-brand-600 transition-all group">
                     <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                     Tambah Varian Baru
                  </button>
               </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Section: Status & Visibility */}
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 font-heading">Visibility</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Active</span>
             </div>
             <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><Layers className="w-5 h-5" /></div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Featured</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="sr-only peer" 
                     checked={isFeatured}
                     onChange={(e) => setIsFeatured(e.target.checked)}
                   />
                   <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Box className="w-5 h-5" /></div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Digital Product</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="sr-only peer" 
                     checked={isDigital}
                     onChange={(e) => setIsDigital(e.target.checked)}
                   />
                   <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
             </div>
          </div>

          {/* Section: Main Media */}
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-600" /> Galeri Utama</h3>
            <div className="grid grid-cols-2 gap-4">
              {mainImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                   <img src={img} className="w-full h-full object-cover" />
                   <button onClick={() => setMainImages(mainImages.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => mainFileInputRef.current?.click()} className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-100 transition-all hover:border-brand-500 hover:text-brand-600"><Plus className="w-8 h-8" /><span className="text-[10px] font-black">ADD PHOTO</span></button>
            </div>
            <input type="file" ref={mainFileInputRef} onChange={handleMainImageUpload} multiple accept="image/*" className="hidden" />
          </div>

          {/* Section: Extra Marketing */}
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2"><Video className="w-5 h-5 text-red-500" /> Video Produk</h3>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Youtube Video URL</label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3">
                   <Video className="w-4 h-4 text-slate-300 mr-3" />
                   <input type="text" placeholder="https://youtube.com/watch?v=..." className="bg-transparent border-none focus:ring-0 outline-none text-sm font-medium w-full p-0" />
                </div>
             </div>
          </div>

          {/* Section: Organization */}
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2"><Settings2 className="w-5 h-5 text-brand-600" /> Pengarsipan</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brand</label>
                   <input type="text" placeholder="e.g. Benih Seribuan" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tags</label>
                   <input type="text" placeholder="Pisahkan dengan koma..." className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
