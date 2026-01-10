import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface Modal {
  id: string
  isOpen: boolean
  data?: any
}

interface UIStore {
  // Toast state
  toasts: Toast[]
  
  // Modal state
  modals: Record<string, Modal>
  
  // Loading state
  isLoading: boolean
  loadingMessage: string | null
  
  // Sidebar state
  isSidebarOpen: boolean
  
  // Actions - Toast
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Actions - Modal
  openModal: (id: string, data?: any) => void
  closeModal: (id: string) => void
  isModalOpen: (id: string) => boolean
  
  // Actions - Loading
  setLoading: (isLoading: boolean, message?: string) => void
  
  // Actions - Sidebar
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
}

let toastCounter = 0

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  toasts: [],
  modals: {},
  isLoading: false,
  loadingMessage: null,
  isSidebarOpen: false,

  // Toast actions
  addToast: (toast) => {
    const id = `toast-${++toastCounter}-${Date.now()}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },

  // Modal actions
  openModal: (id, data) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { id, isOpen: true, data },
      },
    }))
  },

  closeModal: (id) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { ...state.modals[id], isOpen: false },
      },
    }))
  },

  isModalOpen: (id) => {
    return get().modals[id]?.isOpen || false
  },

  // Loading actions
  setLoading: (isLoading, message) => {
    set({
      isLoading,
      loadingMessage: message || null,
    })
  },

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    }))
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen })
  },
}))