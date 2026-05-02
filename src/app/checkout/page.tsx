'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Truck, CreditCard, ChevronRight, ShieldCheck, ShoppingBag, Plus, Info, Loader2, X, Zap } from 'lucide-react'
import { formatRupiah, cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'next/navigation'
import AddressModal from '@/components/addresses/AddressModal'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getTotalItems, getTotalWeight, clearCart } = useCartStore()
  
  const [addressesList, setAddressesList] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // RajaOngkir States
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [couriers, setCouriers] = useState<any[]>([])
  const [selectedCourier, setSelectedCourier] = useState<any>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  
  // Voucher States
  const [couponCode, setCouponCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null)
  const [loadingVoucher, setLoadingVoucher] = useState(false)
  const [voucherError, setVoucherError] = useState('')

  const isDigitalOnly = items.every(item => item.isDigital)

  const [editingAddress, setEditingAddress] = useState<any>(null)

  useEffect(() => {
    fetchAddresses()
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (selectedAddress) {
      calculateCosts('jne') // Default JNE
    }
  }, [selectedAddress])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses')
      const data = await res.json()
      if (Array.isArray(data)) {
        setAddressesList(data)
        const def = data.find(a => a.isDefault) || data[0]
        if (def) setSelectedAddress(def)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    const res = await fetch('/api/shipping?type=provinces')
    const data = await res.json()
    if (Array.isArray(data)) setProvinces(data)
  }

  const fetchCities = async (provId: string) => {
    const res = await fetch(`/api/shipping?type=cities&provinceId=${provId}`)
    const data = await res.json()
    if (Array.isArray(data)) setCities(data)
  }

  const calculateCosts = async (courier: string) => {
    if (!selectedAddress?.cityId) return
    setLoadingShipping(true)
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedAddress.cityId,
          weight: getTotalWeight() || 1000,
          courier: courier
        })
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        const mapped = data.map(c => ({
          id: `${courier}-${c.service}`,
          name: `${courier.toUpperCase()} ${c.service}`,
          price: c.cost[0].value,
          desc: `Estimasi ${c.cost[0].etd} hari`,
          raw: c
        }))
        setCouriers(mapped)
        setSelectedCourier(mapped[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingShipping(false)
    }
  }

  const handleAddressSuccess = async () => {
    await fetchAddresses()
    setShowAddressModal(false)
    setEditingAddress(null)
  }

  const handleApplyVoucher = async () => {
    if (!couponCode) return
    setLoadingVoucher(true)
    setVoucherError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      })
      const data = await res.json()
      if (res.ok) {
        setAppliedVoucher(data.voucher)
      } else {
        setVoucherError(data.error)
        setAppliedVoucher(null)
      }
    } catch (error) {
      setVoucherError('Gagal memvalidasi kupon')
    } finally {
      setLoadingVoucher(false)
    }
  }

  const subtotal = getTotal()
  const discount = appliedVoucher?.discount || 0
  const shippingCost = (appliedVoucher?.type === 'free_shipping') ? 0 : (selectedCourier?.price || 0)
  const total = Math.max(0, subtotal - discount + shippingCost)

  const handleCreateOrder = async () => {
    if (!isDigitalOnly && !selectedAddress) {
      alert('Silakan pilih alamat pengiriman.')
      setShowAddressModal(true)
      return
    }
    if (!isDigitalOnly && !selectedCourier) {
      alert('Silakan pilih kurir.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          subtotal,
          shippingCost,
          total,
          shippingAddress: selectedAddress,
          paymentMethod: 'xendit',
        })
      })

      const data = await res.json()
      if (res.ok) {
        clearCart()
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl // Redirect to Xendit
        } else {
          router.push(`/pesanan/${data.orderNumber}`)
        }
      } else {
        alert(data.error || 'Gagal membuat pesanan')
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan koneksi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
         <ShoppingBag className="w-16 h-16 text-slate-200 mb-6" />
         <h1 className="text-2xl font-black mb-2">Keranjang Kosong</h1>
         <p className="text-slate-500 mb-8">Anda belum memilih benih apapun.</p>
         <Link href="/toko" className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-black">Mulai Belanja</Link>
       </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
           <Link href="/keranjang" className="flex items-center gap-2 text-brand-700 font-bold">
              <ChevronRight className="w-5 h-5 rotate-180" />
              Kembali
           </Link>
           <h1 className="text-xl font-black font-heading uppercase tracking-widest text-gray-900">Checkout</h1>
           <div className="w-24" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-8">
             {!isDigitalOnly && (
               <>
                 {/* Alamat */}
                 <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-black font-heading flex items-center gap-3">
                       <MapPin className="w-5 h-5 text-brand-700" />
                       Alamat Pengiriman
                     </h3>
                     <button onClick={() => setShowAddressModal(true)} className="text-sm font-bold text-brand-700 hover:underline">
                       {addressesList.length > 0 ? 'Ganti Alamat' : 'Tambah Alamat'}
                     </button>
                   </div>
                   
                   {loading ? (
                     <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     </div>
                   ) : selectedAddress ? (
                     <div className="p-6 rounded-3xl bg-brand-50/50 border-2 border-brand-700">
                        <h4 className="font-bold text-gray-900 mb-2">{selectedAddress.recipientName} ({selectedAddress.label})</h4>
                        <p className="text-sm text-gray-600 mb-2">{selectedAddress.phone}</p>
                        <p className="text-sm text-gray-500">
                          {selectedAddress.address}, {selectedAddress.district}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                        </p>
                     </div>
                   ) : (
                     <button onClick={() => setShowAddressModal(true)} className="w-full p-10 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                       Tambah Alamat Pengiriman
                     </button>
                   )}
                 </div>

                {/* Kurir */}
                <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-8">
                    <Truck className="w-5 h-5 text-brand-700" />
                    Pilih Kurir
                  </h3>
                  
                  <div className="flex gap-2 mb-6">
                    {['jne', 'pos', 'tiki'].map(c => (
                      <button 
                        key={c}
                        onClick={() => calculateCosts(c)}
                        className={cn(
                          "px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                          selectedCourier?.id.startsWith(c) ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {loadingShipping ? (
                    <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                       <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : couriers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {couriers.map((c) => (
                         <button 
                           key={c.id}
                           onClick={() => setSelectedCourier(c)}
                           className={cn(
                             "p-6 rounded-3xl border-2 text-left transition-all",
                             selectedCourier?.id === c.id ? "border-brand-700 bg-brand-50/30" : "border-gray-100"
                           )}
                         >
                           <div className="flex justify-between items-start mb-2">
                             <span className="font-bold text-gray-900">{c.name}</span>
                             <span className="text-sm font-black text-brand-700">{formatRupiah(c.price)}</span>
                           </div>
                           <p className="text-xs text-gray-500">{c.desc}</p>
                         </button>
                       ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Pilih alamat terlebih dahulu untuk melihat opsi kurir</p>
                  )}
                </div>
               </>
             )}

             {isDigitalOnly && (
                <div className="p-8 rounded-[40px] bg-brand-50 border border-brand-100 flex items-start gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100">
                      <ShoppingBag className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black font-heading text-brand-900 mb-2">Produk Digital</h3>
                      <p className="text-sm text-brand-700 font-medium leading-relaxed">
                        Anda hanya membeli produk digital. Tidak diperlukan alamat pengiriman dan link unduhan akan tersedia segera setelah pembayaran terkonfirmasi.
                      </p>
                   </div>
                </div>
             )}

            {/* Pembayaran */}
            <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-brand-700" />
                  Metode Pembayaran
                </h3>
                <div className="w-full p-6 rounded-3xl border-2 border-brand-700 bg-brand-50/30 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-gray-900 mb-1">Xendit (QRIS, VA, E-Wallet)</span>
                    <p className="text-xs text-gray-500">Konfirmasi otomatis dan aman</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-brand-700" />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <h3 className="text-lg font-black font-heading flex items-center gap-3 mb-6">
                   <Zap className="w-5 h-5 text-amber-500" />
                   Gunakan Kode Promo
                </h3>
                <div className="flex gap-3">
                   <input 
                     type="text" 
                     placeholder="KODEPROMO"
                     value={couponCode}
                     onChange={e => setCouponCode(e.target.value.toUpperCase())}
                     disabled={appliedVoucher}
                     className="flex-1 p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm uppercase placeholder:text-slate-300"
                   />
                   <button 
                     onClick={appliedVoucher ? () => { setAppliedVoucher(null); setCouponCode('') } : handleApplyVoucher}
                     disabled={loadingVoucher}
                     className={cn(
                       "px-6 rounded-2xl font-black text-xs transition-all",
                       appliedVoucher ? "bg-red-50 text-red-500" : "bg-slate-900 text-white"
                     )}
                   >
                     {loadingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : appliedVoucher ? 'Hapus' : 'Gunakan'}
                   </button>
                </div>
                {voucherError && <p className="mt-2 text-[10px] font-bold text-red-500 px-2 uppercase tracking-widest">{voucherError}</p>}
                {appliedVoucher && <p className="mt-2 text-[10px] font-bold text-brand-600 px-2 uppercase tracking-widest">Kupon {appliedVoucher.code} berhasil dipasang!</p>}
              </div>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 p-8 rounded-[40px] border border-gray-100 bg-white shadow-2xl space-y-8">
              <h3 className="text-xl font-black text-slate-900 font-heading">Ringkasan Pesanan</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ongkir</span>
                  <span className="font-bold">{formatRupiah(shippingCost)}</span>
                </div>
                {discount > 0 && (
                   <div className="flex justify-between text-sm text-brand-600 font-bold">
                      <span>Diskon Promo</span>
                      <span>-{formatRupiah(discount)}</span>
                   </div>
                )}
                <div className="pt-6 border-t flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-brand-600">{formatRupiah(total)}</span>
                </div>
              </div>

              <button 
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Bayar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Alamat */}
      {showAddressModal && (
        <AddressModal 
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false)
            setEditingAddress(null)
          }}
          address={editingAddress}
          onSuccess={handleAddressSuccess}
        />
      )}
    </div>
  )
}
