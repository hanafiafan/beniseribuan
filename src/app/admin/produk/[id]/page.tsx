'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, Globe, Loader2, X, Upload, Percent } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Variant {
  id?: number
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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mainImages, setMainImages] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [hasVariants, setHasVariants] = useState(false)
  const [specs, setSpecs] = useState<Spec[]>([])

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

  useEffect(() => {
    if (productId) {
      fetch(`/api/admin/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error)
            router.push('/admin/produk')
            return
          }
          
          setName(data.name || '')
          setSlug(data.slug || '')
          setShortDescription(data.shortDescription || '')
          setDescription(data.description || '')
          setPrice(data.price || '')
          setSalePrice(data.salePrice || '')
          setStock(data.stock?.toString() || '0')
          setWeight(data.weight?.toString() || '0')
          setCategoryId(data.categoryId?.toString() || '')
          setBrand(data.brand || 'Benih Seribuan')
          setIsFeatured(!!data.isFeatured)
          setIsDigital(!!data.isDigital)
          
          if (data.images) {
            setMainImages(data.images.map((img: any) => img.url))
          }
          
          if (data.specs) {
            try {
              const parsedSpecs = typeof data.specs === 'string' ? JSON.parse(data.specs) : data.specs
              setSpecs(Array.isArray(parsedSpecs) ? parsedSpecs : [])
            } catch (e) {
              setSpecs([])
            }
          }

          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          alert("Gagal memuat data produk")
          router.push('/admin/produk')
        })
    }
  }, [productId, router])

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setMainImages(prev => [...prev, ...newImages])
    }
  }

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name,
          slug,
          description,
          shortDescription,
          price,
          salePrice,
          stock,
          weight,
          categoryId,
          brand,
          isFeatured,
          isDigital,
          specs
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product')
      }
      
      router.push('/admin/produk')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Gagal mengupdate produk.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      <p className="text-slate-500 font-bold">Memuat data produk...</p>
    </div>
  )

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
            <h1 className="text-4xl font-black text-slate-900 font-heading tracking-tight">Edit Produk</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
               <Globe className="w-4 h-4 text-brand-500" />
               Perbarui detail produk Anda di sini.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSubmit}
             disabled={saving}
             className="flex items-center gap-3 px-10 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50"
           >
             <Save className="w-5 h-5" />
             {saving ? 'Menyimpan...' : 'Update Produk'}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900 text-lg" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">URL Slug</label>
                    <input 
                      type="text" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-600" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Singkat</label>
                <textarea 
                  rows={2} 
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-medium text-slate-600 resize-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi Lengkap</label>
                <textarea 
                  rows={10} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-6 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-brand-500 outline-none font-medium text-slate-600 resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-10">
            <h3 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-black">02</span>
              Spesifikasi Produk
            </h3>
            <div className="space-y-6">
               {specs.map((spec, i) => (
                 <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-[24px]">
                    <div className="flex-1 space-y-2">
                       <input 
                         type="text" 
                         placeholder="Label" 
                         value={spec.label}
                         onChange={(e) => { const ns = [...specs]; ns[i].label = e.target.value; setSpecs(ns) }}
                         className="w-full px-5 py-3 bg-white rounded-xl border-none font-bold text-slate-900 text-sm" 
                       />
                    </div>
                    <div className="flex-1 space-y-2">
                       <input 
                         type="text" 
                         placeholder="Value" 
                         value={spec.value}
                         onChange={(e) => { const ns = [...specs]; ns[i].value = e.target.value; setSpecs(ns) }}
                         className="w-full px-5 py-3 bg-white rounded-xl border-none font-medium text-slate-600 text-sm" 
                       />
                    </div>
                    <button onClick={() => removeSpec(i)} className="p-3 text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                 </div>
               ))}
               <button onClick={addSpec} className="text-brand-600 font-black text-xs uppercase tracking-widest">+ Tambah Atribut</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
           {/* Section 3: Pricing & Inventory */}
           <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Harga & Stok</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Normal</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2"><Percent className="w-3 h-3" /> Harga Diskon</label>
                    <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl border-none font-black" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stok Ready</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-black" />
                 </div>
              </div>
           </div>

           {/* Section 4: Visibility */}
           <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-sm font-bold text-slate-600">Produk Unggulan</span>
                 <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 text-brand-600 rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-sm font-bold text-slate-600">Produk Digital</span>
                 <input type="checkbox" checked={isDigital} onChange={(e) => setIsDigital(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
              </label>
           </div>

           {/* Section 5: Gallery */}
           <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Galeri</h3>
              <div className="grid grid-cols-2 gap-4">
                 {mainImages.map((img, i) => (
                   <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button onClick={() => setMainImages(mainImages.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                   </div>
                 ))}
                 <button onClick={() => mainFileInputRef.current?.click()} className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400"><Plus className="w-8 h-8" /></button>
              </div>
              <input type="file" ref={mainFileInputRef} onChange={handleMainImageUpload} multiple className="hidden" />
           </div>
        </div>
      </div>
    </div>
  )
}
