// Dummy data service for stock items
import type { StockItem } from '../../../types/Admin'

export const getStockItems = (): StockItem[] => {
  return [
    {
      id: '001',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Green',
      size: 'XL',
      quantity: 3,
      price: 100,
      imageUrl: '',
    },
    {
      id: '002',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Blue',
      size: 'S',
      quantity: 3,
      price: 100,
      imageUrl: '',
    },
    {
      id: '003',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Green',
      size: 'M',
      quantity: 3,
      price: 100,
      imageUrl: '',
    },
    {
      id: '004',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Yellow',
      size: 'L',
      quantity: 3,
      price: 100,
      imageUrl: '',
    },
    {
      id: '005',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Red',
      size: 'XL',
      quantity: 100,
      price: 100,
      imageUrl: '',
    },
    {
      id: '006',
      itemId: '001',
      productName: 'Old English Hoodie',
      color: 'Black',
      size: 'XL',
      quantity: 100,
      price: 100,
      imageUrl: '',
    },
  ]
}

export const searchStockItems = (query: string, items: StockItem[]): StockItem[] => {
  if (!query.trim()) return items
  return items.filter(
    (item) =>
      item.productName.toLowerCase().includes(query.toLowerCase()) ||
      item.color.toLowerCase().includes(query.toLowerCase()) ||
      item.size.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase())
  )
}

export const deleteStockItem = (id: string): void => {
  // TODO: Implement API call to delete stock item
  console.log(`Delete stock item: ${id}`)
}
