// Dummy data service for admin products
import type { AdminProduct } from '../../../types/Admin'

export const getAdminProducts = (): AdminProduct[] => {
  return [
    {
      id: '001',
      productName: 'Old English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Shirt Monkey',
      imageUrl: '',
      price: 99.99,
    },
    {
      id: '002',
      productName: 'Blue English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Direct',
      imageUrl: '',
      price: 89.99,
    },
    {
      id: '003',
      productName: 'Yellow English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Shirt Monkey',
      imageUrl: '',
      price: 89.99,
    },
    {
      id: '004',
      productName: 'Brown English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Shirt Monkey',
      imageUrl: '',
      price: 79.99,
    },
    {
      id: '005',
      productName: 'Black English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Shirt Monkey',
      imageUrl: '',
      price: 84.99,
    },
    {
      id: '006',
      productName: 'Green English Hoodie',
      description: 'The Project ZerO\'s Puffer...',
      brandId: '002',
      brandName: 'Shirt Monkey',
      deliveryMethod: 'Shirt Monkey',
      imageUrl: '',
      price: 94.99,
    },
  ]
}

export const searchProducts = (query: string, products: AdminProduct[]): AdminProduct[] => {
  if (!query.trim()) return products
  return products.filter((product) =>
    product.productName.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.id.toLowerCase().includes(query.toLowerCase())
  )
}

export const deleteProduct = (id: string): void => {
  // TODO: Implement API call to delete product
  console.log(`Delete product: ${id}`)
}
