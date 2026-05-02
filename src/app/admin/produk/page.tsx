'use client'
import { useState, useEffect } from 'react'
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2, ExternalLink, Loader2, ChevronRight, AlertCircle } from 'lucide-react'
import { formatRupiah, cn } from '@/lib/utils'
import Link from 'next/link'

export default function AdminProdukPage() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProductsList(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProducts()
      } else {
        const data = await res.json()
        alert(data.error || 'Gagal menghapus produk')
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan sistem')
    }
  }

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toString().includes(searchQuery)
  )

  return (
    <div className="space-y-6 sm:space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Manage your seed inventory and storefront products.</p>
        </div>
        <Link 
          href="/admin/produk/tambah"
          className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-600/10 hover:bg-brand-700 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
         <div className="relative w-full flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand-500 outline-none font-medium" 
            />
         </div>
         <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-bold text-sm">
            <Filter className="w-4 h-4" />
            Filters
         </button>
      </div>

      {/* Data Section */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <Package className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">
              Your search didn't match any products. Try different keywords or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
             {/* Desktop Table View */}
             <table className="w-full text-left hidden md:table border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredProducts.map((product) => (
                   <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                           {product.images?.[0]?.url ? (
                             <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-5 h-5" /></div>
                           )}
                         </div>
                         <div className="min-w-0">
                           <p className="font-black text-slate-900 truncate">{product.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">SKU: #{product.id.toString().padStart(5, '0')}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-5">
                       <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         {product.category?.name || 'Uncategorized'}
                       </span>
                     </td>
                     <td className="px-8 py-5">
                       <p className="font-black text-brand-700">{formatRupiah(Number(product.price))}</p>
                     </td>
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                           <div className={cn(
                             "w-1.5 h-1.5 rounded-full",
                             product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                           )} />
                           <p className={cn("font-bold text-sm", product.stock <= 5 ? "text-red-500" : "text-slate-600")}>
                             {product.stock} <span className="text-[10px] font-medium text-slate-400">in stock</span>
                           </p>
                        </div>
                     </td>
                     <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Link 
                             href={`/admin/produk/${product.id}`}
                             className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                           >
                             <Edit className="w-4 h-4" />
                           </Link>
                           <button 
                             onClick={() => handleDelete(product.id)}
                             className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>

             {/* Mobile Card View */}
             <div className="md:hidden divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-6 space-y-5 active:bg-slate-50 transition-colors">
                     <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                           {product.images?.[0]?.url ? (
                             <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-6 h-6" /></div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                           <div className="flex items-center justify-between gap-4 mb-1">
                              <p className="font-black text-slate-900 truncate text-base leading-tight">{product.name}</p>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">#{product.id}</span>
                           </div>
                           <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                             {product.category?.name || 'General'}
                           </span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price / Stock</p>
                           <div className="flex items-center gap-3">
                              <p className="font-black text-brand-700">{formatRupiah(Number(product.price))}</p>
                              <div className="w-1 h-1 bg-slate-300 rounded-full" />
                              <p className={cn("font-bold text-xs", product.stock <= 5 ? "text-red-500" : "text-slate-600")}>
                                {product.stock} pcs
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Link 
                             href={`/admin/produk/${product.id}`}
                             className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm"
                           >
                             <Edit className="w-4 h-4" />
                           </Link>
                           <button 
                             onClick={() => handleDelete(product.id)}
                             className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-red-500 rounded-xl shadow-sm"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Low Stock Alert Bar */}
      {productsList.some(p => p.stock <= 5) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-amber-600 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-bold">Beberapa produk hampir habis. Segera restock inventory Anda!</p>
           </div>
           <Link href="/admin/pesanan" className="whitespace-nowrap px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black shadow-inner">
              Restock Now
           </Link>
        </div>
      )}
    </div>
  )
}
