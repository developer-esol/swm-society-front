import { create } from 'zustand'
import type { StockItem } from '../types/Admin'
import { getStockItems } from '../api/services/admin/stockService'

interface StockStore {
  stockItems: StockItem[]
  setStockItems: (items: StockItem[]) => void
  addStockItem: (item: StockItem) => void
  updateStockItem: (item: StockItem) => void
  deleteStockItem: (id: string) => void
  initializeStockItems: () => void
  getNextStockItemId: () => string
}

export const useStockStore = create<StockStore>((set, get) => ({
  stockItems: [],
  setStockItems: (items) => set({ stockItems: items }),
  addStockItem: (item) =>
    set((state) => ({
      stockItems: [...state.stockItems, item],
    })),
  updateStockItem: (item) =>
    set((state) => ({
      stockItems: state.stockItems.map((s) => (s.id === item.id ? item : s)),
    })),
  deleteStockItem: (id) =>
    set((state) => ({
      stockItems: state.stockItems.filter((s) => s.id !== id),
    })),
  initializeStockItems: () => set({ stockItems: getStockItems() }),
  getNextStockItemId: () => {
    const state = get()
    if (state.stockItems.length === 0) return '001'
    // Find the highest numeric ID and increment it
    const ids = state.stockItems
      .map((s) => parseInt(s.id, 10))
      .filter((id) => !isNaN(id))
    const maxId = ids.length > 0 ? Math.max(...ids) : 0
    return String(maxId + 1).padStart(3, '0')
  },
}))
