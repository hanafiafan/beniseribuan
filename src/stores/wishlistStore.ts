import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: number[]
  toggle: (productId: number | string) => void
  isWishlisted: (productId: number | string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const id = Number(productId)
        if (isNaN(id)) return
        
        set((state) => ({
          items: state.items.includes(id)
            ? state.items.filter(i => i !== id)
            : [...state.items, id],
        }))
      },
      isWishlisted: (productId) => {
        const id = Number(productId)
        return get().items.includes(id)
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'bsb-wishlist' }
  )
)

