export interface StatBox {
  icon: string
  label: string
  value: string | number
}

export interface SalesRevenueData {
  currentWeek: number
  previousWeek: number
  trend: number[]
}

export interface LocationData {
  city: string
  sales: number
}

export interface SalesChartData {
  label: string
  value: number
  percentage: number
}

export interface TopProduct {
  id: string
  name: string
  price: number
  quantity: number
  amount: number
}

export interface DashboardData {
  statBoxes: StatBox[]
  salesRevenue: SalesRevenueData
  revenueByLocation: LocationData[]
  totalSalesChart: SalesChartData[]
  topProducts: TopProduct[]
}
