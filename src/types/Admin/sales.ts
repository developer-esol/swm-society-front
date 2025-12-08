export type SalesStatus = 'Pending' | 'Packaged' | 'Delivered' | 'Returned'

export interface SalesTransaction {
  id: string
  orderId: string
  userId: string
  productId: string
  quantity: number
  size: string
  color: string
  unitPrice: number
  total: number
  date: string
  status: SalesStatus
}

export interface SalesFilters {
  startDate?: string
  endDate?: string
  status?: SalesStatus | 'all'
}

export interface SalesData {
  transactions: SalesTransaction[]
  total: number
  count: number
}
