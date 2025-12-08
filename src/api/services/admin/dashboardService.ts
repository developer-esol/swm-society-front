// Dummy data service for admin dashboard
import type { DashboardData } from '../../../types/Admin'

export const getDashboardData = (): DashboardData => {
  return {
    statBoxes: [
      {
        icon: 'shopping_bag',
        label: 'TOTAL PRODUCTS',
        value: 3456,
      },
      {
        icon: 'shopping_cart',
        label: 'ORDERS',
        value: 3456,
      },
      {
        icon: 'trending_up',
        label: 'TOTAL SALES',
        value: '$3456',
      },
    ],
    salesRevenue: {
      currentWeek: 58211,
      previousWeek: 48748,
      trend: [10, 12, 15, 18, 22, 25, 28, 32, 35, 38, 40, 45, 50, 55],
    },
    revenueByLocation: [
      { city: 'New York', sales: 72 },
      { city: 'San Francisco', sales: 39 },
      { city: 'Sydney', sales: 25 },
      { city: 'Singapore', sales: 61 },
    ],
    totalSalesChart: [
      { label: 'Direct', value: 30056, percentage: 42.8 },
      { label: 'Shift Monkey', value: 13538, percentage: 19.3 },
      { label: 'Returned', value: 7802, percentage: 11.1 },
      { label: 'Failed', value: 1896, percentage: 2.7 },
    ],
    topProducts: [
      {
        id: '1',
        name: "Project Zero's Old English Hoodie",
        price: 79.49,
        quantity: 82,
        amount: 6518.18,
      },
      {
        id: '2',
        name: "Project Zero's Old English Hoodie",
        price: 128.5,
        quantity: 37,
        amount: 4754.5,
      },
      {
        id: '3',
        name: "Project Zero's Old English Hoodie",
        price: 33.99,
        quantity: 64,
        amount: 2559.36,
      },
      {
        id: '4',
        name: "Project Zero's Old English Hoodie",
        price: 20.0,
        quantity: 184,
        amount: 3680.0,
      },
      {
        id: '5',
        name: "Project Zero's Old English Hoodie",
        price: 79.49,
        quantity: 64,
        amount: 1965.81,
      },
    ],
  };
};
