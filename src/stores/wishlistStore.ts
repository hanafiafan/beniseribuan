import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: number[]
  toggle: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => set((state) => ({
        items: state.items.includes(productId)
          ? state.items.filter(id => id !== productId)
          : [...state.items, productId],
      })),
      isWishlisted: (productId) => get().items.includes(productId),
      clear: () => set({ items: [] }),
    }),
    { name: 'bsb-wishlist' }
  )
)
