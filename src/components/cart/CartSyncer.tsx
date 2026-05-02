'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/stores/cartStore'
import { useSession } from 'next-auth/react'

export default function CartSyncer() {
  const { items } = useCartStore()
  const { data: session, status } = useSession()
  const lastItemsRef = useRef(JSON.stringify(items))

  useEffect(() => {
    // Only sync if logged in and items actually changed
    if (status !== 'authenticated' || !session?.user) return

    const currentItemsStr = JSON.stringify(items)
    if (currentItemsStr === lastItemsRef.current) return

    const syncCart = async () => {
      try {
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        })
        lastItemsRef.current = currentItemsStr
      } catch (error) {
        console.error('Failed to sync cart to server:', error)
      }
    }

    const timer = setTimeout(syncCart, 2000) // Debounce 2s to avoid spamming server
    return () => clearTimeout(timer)
  }, [items, session, status])

  return null // Invisible component
}
