import { create } from 'zustand'
import type { AdminProduct } from '../types/Admin'
import { getAdminProducts } from '../api/services/admin/productsService'

interface ProductsStore {
  products: AdminProduct[]
  setProducts: (products: AdminProduct[]) => void
  addProduct: (product: AdminProduct) => void
  updateProduct: (product: AdminProduct) => void
  deleteProduct: (id: string) => void
  initializeProducts: () => void
  getNextProductId: () => string
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  initializeProducts: () => set({ products: getAdminProducts() }),
  getNextProductId: () => {
    const state = get()
    if (state.products.length === 0) return '001'
    // Find the highest numeric ID and increment it
    const ids = state.products
      .map((p) => parseInt(p.id, 10))
      .filter((id) => !isNaN(id))
    const maxId = ids.length > 0 ? Math.max(...ids) : 0
    return String(maxId + 1).padStart(3, '0')
  },
}))
