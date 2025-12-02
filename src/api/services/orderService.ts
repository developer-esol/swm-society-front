import type { Order, OrdersResponse } from '../../types/order';

// Dummy order data
const dummyOrdersData: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user1',
    items: [
      {
        id: '1',
        productId: 'prod-002',
        productName: 'Classic Red Jacket',
        price: 120,
        quantity: 1,
        color: 'Red',
        size: 'L',
        image: '/redjacket.jpg',
        status: 'Processing',
      },
    ],
    totalPrice: 120,
    orderDate: '25-10-2025',
    createdAt: '2025-10-25T14:22:00Z',
    updatedAt: '2025-10-25T14:22:00Z',
  },
  {
    id: 'ORD-002',
    userId: 'user1',
    items: [
      {
        id: '2',
        productId: 'prod-003',
        productName: 'Black Leather Jacket',
        price: 150,
        quantity: 1,
        color: 'Black',
        size: 'XL',
        image: '/blackjacket.jpg',
        status: 'Delivered',
      },
    ],
    totalPrice: 150,
    orderDate: '20-10-2025',
    createdAt: '2025-10-20T11:45:00Z',
    updatedAt: '2025-10-20T11:45:00Z',
  },
  {
    id: 'ORD-005',
    userId: 'user1',
    items: [
      {
        id: '5',
        productId: 'prod-004',
        productName: 'Thomas Mushet Legacy Jacket',
        price: 200,
        quantity: 1,
        color: 'Charcoal',
        size: 'M',
        image: '/blackjacket.jpg',
        status: 'Shipped',
      },
    ],
    totalPrice: 200,
    orderDate: '15-10-2025',
    createdAt: '2025-10-15T08:15:00Z',
    updatedAt: '2025-10-15T08:15:00Z',
  },
];

export const orderService = {
  /**
   * Get all orders for a user
   */
  async getUserOrders(userId?: string, page = 1, limit = 10): Promise<OrdersResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      orders: dummyOrdersData,
      total: dummyOrdersData.length,
      page,
      limit,
    };
  },

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = dummyOrdersData.find(o => o.id === orderId);
    return order || null;
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = dummyOrdersData.find(o => o.id === orderNumber);
    return order || null;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const order = dummyOrdersData.find(o => o.id === orderId);
    if (order) {
      order.items.forEach(item => {
        if (item.status !== 'Delivered') {
          item.status = 'Cancelled';
        }
      });
    }
    return order || null;
  },

  /**
   * Track order status
   */
  async trackOrder(orderId: string): Promise<{ status: string; estimatedDelivery?: string } | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = dummyOrdersData.find(o => o.id === orderId);
    if (!order) return null;

    const item = order.items[0];
    let estimatedDelivery: string | undefined;

    if (item.status === 'Processing') {
      estimatedDelivery = 'Within 3-5 business days';
    } else if (item.status === 'Shipped') {
      estimatedDelivery = 'Within 2-3 business days';
    }

    return {
      status: item.status,
      estimatedDelivery,
    };
  },
};
