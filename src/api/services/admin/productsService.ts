import { apiClient } from '../../apiClient'
import type { AdminProduct } from '../../../types/Admin'

// Updated service to fetch from backend API
export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  try {
    const products = await apiClient.get<any[]>('/products?page=1&limit=10')
    // Transform backend response to AdminProduct format
    return products.map((product) => ({
      id: product.id,
      productName: product.name,
      description: product.description,
      brandId: product.brandId,
      deliveryMethod: product.deliveryMethod,
      imageUrl: product.imageUrl || '',
      price: parseFloat(product.price) || 0,
    }))
  } catch (error) {
    console.error('Failed to fetch admin products:', error)
    // Return empty array on error
    return []
  }
}

export const searchProducts = (query: string, products: AdminProduct[]): AdminProduct[] => {
  if (!query.trim()) return products
  return products.filter((product) =>
    product.productName.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.id.toLowerCase().includes(query.toLowerCase())
  )
}

export const updateAdminProduct = async (productId: string, productData: Partial<AdminProduct>): Promise<AdminProduct> => {
  try {
    const updatedProduct = await apiClient.put<any>(`/products/${productId}`, {
      brandId: productData.brandId,
      name: productData.productName,
      price: productData.price || 0,  // Send as number, not string
      description: productData.description,
      imageUrl: productData.imageUrl,
      deliveryMethod: productData.deliveryMethod,
    })
    
    // Transform response back to AdminProduct format
    return {
      id: updatedProduct.id,
      productName: updatedProduct.name,
      description: updatedProduct.description,
      brandId: updatedProduct.brandId,
      brandName: updatedProduct.brandName || `Brand ${updatedProduct.brandId}`,
      deliveryMethod: updatedProduct.deliveryMethod,
      imageUrl: updatedProduct.imageUrl || '',
      price: parseFloat(updatedProduct.price) || 0,
    }
  } catch (error) {
    console.error('Failed to update product:', error)
    throw error
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/products/${id}`)
    return true
  } catch (error) {
    console.error('Failed to delete product:', error)
    throw error
  }
}
