import { apiClient } from '../../apiClient'
import type { AdminProduct } from '../../../types/Admin'
import { brandService } from '../brandService'

// Helper to map brand slug to brandId
const getBrandIdFromSlug = async (brandSlug: string | null): Promise<string | null> => {
  if (!brandSlug) return null
  
  try {
    const brands = await brandService.getBrands()
    
    // Map slug to brand name variations
    const slugToBrandMap: Record<string, string[]> = {
      'project-zero': ['Project Zero', 'Project ZerO', 'Project ZerO\'s', 'Project Zeros'],
      'thomas-mushet': ['Thomas Mushet', 'thomas mushet'],
      'hear-my-voice': ['Hear My Voice', 'HMV']
    }
    
    const brandNames = slugToBrandMap[brandSlug] || []
    const matchingBrand = brands.find(brand => 
      brandNames.some(name => brand.brandName.toLowerCase().includes(name.toLowerCase()))
    )
    
    return matchingBrand?.id || null
  } catch (error) {
    console.error('Failed to get brandId from slug:', error)
    return null
  }
}

// Updated service to fetch from backend API with brand-specific endpoint
export const getAdminProducts = async (brandSlug?: string | null): Promise<AdminProduct[]> => {
  try {
    // First, fetch all brands to create a lookup map
    const brands = await brandService.getBrands()
    console.log('=== BRANDS FETCHED ===')
    console.log('Brands:', brands)
    
    // Create brandId -> brandName lookup map
    const brandMap = new Map<string, string>()
    brands.forEach(brand => {
      brandMap.set(brand.id, brand.brandName)
    })
    console.log('Brand map:', Object.fromEntries(brandMap))
    
    // Get brandId if brandSlug is provided
    const brandId = brandSlug ? await getBrandIdFromSlug(brandSlug) : null
    console.log('Brand slug:', brandSlug, 'Brand ID:', brandId)
    
    // Use brand-specific endpoint if brandId exists, otherwise fetch all
    const endpoint = brandId ? `/products/brand/${brandId}` : '/products?page=1&limit=100'
    console.log('Fetching from endpoint:', endpoint)
    
    const response = await apiClient.get<any>(endpoint)
    console.log('=== API RESPONSE ===')
    console.log('Full response:', response)
    
    // Handle if response is wrapped in an object
    const products = Array.isArray(response) ? response : (response.products || response.data || [])
    console.log('Products count:', products.length)
    
    if (products.length === 0) {
      console.warn('No products returned from API')
      return []
    }
    
    // Transform backend response to AdminProduct format with brand names
    const transformed = products.map((product: any) => {
      const brandName = brandMap.get(product.brandId) || 'Unknown'
      const result = {
        id: product.id,
        productName: product.name,
        description: product.description,
        brandId: product.brandId,
        brandName: brandName,
        deliveryMethod: product.deliveryMethod,
        imageUrl: product.imageUrl || '',
        price: parseFloat(product.price) || 0,
      }
      console.log('Transformed product:', result)
      return result
    })
    
    console.log('All transformed products:', transformed)
    return transformed
  } catch (error) {
    console.error('Failed to fetch admin products:', error)
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
