import { useMemo } from 'react'
import { getDashboardData } from '../../api/services/admin'
import type { DashboardData } from '../../types/Admin'
import { useAdminProducts } from '../useProducts'
import { useAdminUsers } from '../useUsers'

export const useDashboard = (): DashboardData => {
  const { data: products = [] } = useAdminProducts()
  const { data: users = [] } = useAdminUsers()
  
  return useMemo(() => {
    const baseData = getDashboardData()
    
    // Update stat boxes with real data
    const updatedStatBoxes = baseData.statBoxes.map(statBox => {
      if (statBox.label === 'TOTAL PRODUCTS') {
        return { ...statBox, value: products.length }
      }
      if (statBox.label === 'TOTAL USERS') {
        return { ...statBox, value: users.length }
      }
      // Keep ORDERS as dummy data (no orders yet)
      return statBox
    })
    
    return {
      ...baseData,
      statBoxes: updatedStatBoxes
    }
  }, [products.length, users.length])
}
