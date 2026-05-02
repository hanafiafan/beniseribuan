import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareState {
  items: any[]
  addItem: (product: any) => void
  removeItem: (productId: number) => void
  clear: () => void
  isInCompare: (productId: number) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const current = get().items
        if (current.find(item => item.id === product.id)) return
        if (current.length >= 4) {
          // Limit to 4 products
          alert('Maksimal perbandingan adalah 4 produk.')
          return
        }
        set({ items: [...current, product] })
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) })
      },
      clear: () => set({ items: [] }),
      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId)
      }
    }),
    {
      name: 'beniseribuan-compare'
    }
  )
)
