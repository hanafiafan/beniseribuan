'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, MapPin, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CookieConsent = () => {
  const [show, setShow] = useState(false)
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const consent = localStorage.getItem('bsb-cookie-consent')
    if (!consent) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('bsb-cookie-consent', 'accepted')
    setShow(false)
    requestLocation()
  }

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location access granted:', position.coords)
          localStorage.setItem('bsb-user-location', JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
          setLocationPermission(true)
        },
        (error) => {
          console.error('Location access denied:', error)
          setLocationPermission(false)
        }
      )
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 p-6 rounded-[32px] shadow-2xl shadow-emerald-900/10">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                <Cookie size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 font-bold text-lg leading-tight">
                  Pengalaman Belanja Lebih Personal
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Kami menggunakan cookies untuk meningkatkan layanan. Izinkan akses lokasi untuk melihat estimasi ongkir langsung di produk.
                </p>
              </div>
              <button 
                onClick={() => setShow(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAccept}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-12 font-bold"
              >
                <Check className="mr-2 h-4 w-4" />
                Terima Semua
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShow(false)}
                className="flex-1 border-emerald-200 text-emerald-700 rounded-full h-12 font-bold hover:bg-emerald-50"
              >
                Atur Manual
              </Button>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              <MapPin size={12} />
              <span>Dukung Perhitungan Ongkir Otomatis</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
