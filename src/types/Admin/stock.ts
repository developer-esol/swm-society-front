export interface StockItem {
  id: string
  itemId: string
  productName: string
  color: string
  size: string
  quantity: number
  price: number
  imageUrl: string
}

export interface AddStockFormData {
  productName: string
  color: string
  size: string
  quantity: string
  price: string
  imageUrl: string
}

export interface AddStockPayload extends Omit<AddStockFormData, 'quantity' | 'price'> {
  quantity: number
  price: number
}
