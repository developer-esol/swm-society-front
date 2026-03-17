import { useMemo, useState, useEffect } from 'react'
import { getDashboardData } from '../../api/services/admin'
import type { DashboardData } from '../../types/Admin'
import { useAdminProducts } from '../useProducts'
import { useAdminUsers } from '../useUsers'
import { orderService } from '../../api/services/orderService'
import type { Order } from '../../types/order'

export const useDashboard = (): DashboardData => {
  const { data: products = [] } = useAdminProducts()
  const { data: users = [] } = useAdminUsers()
  const [orders, setOrders] = useState<Order[]>([])
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders(1, 1000)
        setOrders(response.orders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }
    fetchOrders()
  }, [])
  
  return useMemo(() => {
    const baseData = getDashboardData()
    
    // Calculate top selling products from orders
    const productSales = new Map<string, { name: string; price: number; quantity: number; amount: number }>()
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.productName) || { 
          name: item.productName, 
          price: item.price, 
          quantity: 0, 
          amount: 0 
        }
        existing.quantity += item.quantity
        existing.amount += item.price * item.quantity
        productSales.set(item.productName, existing)
      })
    })
    
    // Sort by quantity and take top 5
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
    
    // Update stat boxes with real data
    const updatedStatBoxes = baseData.statBoxes.map(statBox => {
      if (statBox.label === 'TOTAL PRODUCTS') {
        return { ...statBox, value: products.length }
      }
      if (statBox.label === 'TOTAL USERS') {
        return { ...statBox, value: users.length }
      }
      if (statBox.label === 'ORDERS') {
        return { ...statBox, value: orders.length }
      }
      return statBox
    })
    
    return {
      ...baseData,
      statBoxes: updatedStatBoxes,
      topProducts: topProducts.length > 0 ? topProducts : baseData.topProducts
    }
  }, [products.length, users.length, orders])
}
