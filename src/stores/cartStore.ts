import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: number
  variantId?: number
  name: string
  variantName?: string
  price: number
  quantity: number
  image?: string
  stock: number
  weight: number
  isDigital?: boolean
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number, variantId?: number) => void
  updateQuantity: (productId: number, quantity: number, variantId?: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
  getTotalWeight: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        )
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          }
        }
        return { items: [...state.items, item] }
      }),

      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(
          i => !(i.productId === productId && i.variantId === variantId)
        ),
      })),

      updateQuantity: (productId, quantity, variantId) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i
        ),
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalWeight: () => get().items.reduce((sum, i) => sum + i.weight * i.quantity, 0),
    }),
    { name: 'bsb-cart' }
  )
)
