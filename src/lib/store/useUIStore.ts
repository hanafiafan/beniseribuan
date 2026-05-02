import { create } from 'zustand'

interface UIState {
  isLoginModalOpen: boolean
  authView: 'login' | 'register'
  openLoginModal: (view?: 'login' | 'register') => void
  closeLoginModal: () => void
  
  // Kita bisa tambahkan modal lain di sini nanti
  isSearchModalOpen: boolean
  toggleSearchModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoginModalOpen: false,
  authView: 'login',
  openLoginModal: (view = 'login') => set({ isLoginModalOpen: true, authView: view }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  
  isSearchModalOpen: false,
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
}))
