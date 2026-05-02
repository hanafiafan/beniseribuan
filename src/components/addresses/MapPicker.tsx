'use client'

import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { Loader2, Search, MapPin, Check } from 'lucide-react'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: -6.200000,
  lng: 106.816666
}

interface MapPickerProps {
  onSelect: (lat: number, lng: number, addressDetails?: any) => void
  initialLat?: number
  initialLng?: number
}

export default function MapPicker({ onSelect, initialLat, initialLng }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markerPos, setMarkerPos] = useState({
    lat: initialLat || defaultCenter.lat,
    lng: initialLng || defaultCenter.lng
  })
  const [address, setAddress] = useState('')
  const [isGeocoding, setIsGeocoding] = useState(false)

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      setMarkerPos(newPos)
      reverseGeocode(newPos.lat, newPos.lng)
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return
    setIsGeocoding(true)
    const geocoder = new google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({ location: { lat, lng } })
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address)
        
        // Extract address components
        const components = response.results[0].address_components
        const details = {
          formattedAddress: response.results[0].formatted_address,
          postalCode: components.find(c => c.types.includes('postal_code'))?.long_name || '',
          village: components.find(c => c.types.includes('administrative_area_level_4') || c.types.includes('neighborhood'))?.long_name || '',
          district: components.find(c => c.types.includes('administrative_area_level_3'))?.long_name || '',
          city: components.find(c => c.types.includes('administrative_area_level_2'))?.long_name || '',
          province: components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '',
        }
        
        onSelect(lat, lng, details)
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleConfirm = () => {
    onSelect(markerPos.lat, markerPos.lng)
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm font-bold text-slate-400">Memuat Peta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPos}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
              }
            ]
          }}
        >
          <Marker position={markerPos} draggable={true} onDragEnd={(e) => {
             if (e.latLng) {
               const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
               setMarkerPos(newPos)
               reverseGeocode(newPos.lat, newPos.lng)
             }
          }} />
        </GoogleMap>
        
        {/* Floating Search/Address Info */}
        <div className="absolute top-4 left-4 right-4">
           <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi Terpilih</p>
                 <p className="text-xs font-bold text-slate-700 truncate">
                   {isGeocoding ? 'Mencari alamat...' : (address || 'Klik pada peta untuk memilih lokasi')}
                 </p>
              </div>
           </div>
        </div>
      </div>
      
      <p className="text-[10px] text-center text-slate-400 font-medium italic">
        * Anda bisa menggeser Pin atau klik di mana saja pada peta.
      </p>
    </div>
  )
}
