import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareState {
  items: number[]
  addItem: (productId: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  isInCompare: (productId: number) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => set((state) => {
        if (state.items.length >= 4) return state
        if (state.items.includes(productId)) return state
        return { items: [...state.items, productId] }
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(id => id !== productId),
      })),
      clear: () => set({ items: [] }),
      isInCompare: (productId) => get().items.includes(productId),
    }),
    { name: 'bsb-compare' }
  )
)
