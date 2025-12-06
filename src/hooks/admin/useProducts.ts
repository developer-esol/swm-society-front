import { useState, useMemo } from 'react'
import { getAdminProducts, searchProducts, deleteProduct } from '../../api/services/admin/productsService'
import type { AdminProduct } from '../../types/Admin'

export const useProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>(getAdminProducts())
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(
    () => searchProducts(searchQuery, products),
    [searchQuery, products]
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
  }

  return {
    products: filteredProducts,
    allProducts: products,
    searchQuery,
    handleSearch,
    handleDelete,
  }
}
