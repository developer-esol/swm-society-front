import type { Order, OrdersResponse } from '../../types/order';
import { API_BASE_URL } from '../config';

// Helper to get NestJS UUID from Spring Boot userId
async function getNestJsUserUuid(springBootUserId: string): Promise<string> {
  try {
    // Check if already a UUID (contains hyphens)
    if (springBootUserId.includes('-')) {
      return springBootUserId;
    }

    // Fetch from NestJS to get UUID
    const response = await fetch(`${API_BASE_URL}/users?externalId=${springBootUserId}`);
    const users = await response.json();
    
    if (users && users.length > 0 && users[0].id) {
      return users[0].id;
    }

    throw new Error(`No NestJS user found with externalId: ${springBootUserId}`);
  } catch (error) {
    console.error('[OrderService] Failed to get NestJS user UUID:', error);
    throw error;
  }
}

export const orderService = {
  /**
   * Get all orders for a user
   */
  async getUserOrders(userId?: string, page = 1, limit = 10): Promise<OrdersResponse> {
    try {
      // Get userId from localStorage if not provided
      const springBootUserId = userId || localStorage.getItem('userId');
      
      if (!springBootUserId) {
        throw new Error('User not authenticated');
      }

      // Convert to NestJS UUID
      const nestJsUserId = await getNestJsUserUuid(springBootUserId);
      
      const response = await fetch(`${API_BASE_URL}/orders/user/${nestJsUserId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Map API response to Order type
      const orders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        userId: order.userId,
        status: order.status || 'pending',
        contactEmail: order.contactEmail,
        deliveryAddress: order.deliveryAddress,
        date: order.date,
        items: (order.products || []).map((product: any) => ({
          id: product.id || '',
          productId: product.productId || '',
          productName: product.productName,
          price: parseFloat(product.price) || 0,
          quantity: product.quantity || 1,
          color: product.color || '',
          size: product.size || '',
          imageUrl: product.imageUrl || '',
          status: order.status || 'Processing',
        })),
        subtotal: order.subtotal || 0,
        totalPrice: order.total || 0,
        orderDate: order.date ? new Date(order.date).toLocaleDateString() : '',
        createdAt: order.date || new Date().toISOString(),
        updatedAt: order.date || new Date().toISOString(),
      }));

      return {
        orders,
        total: orders.length,
        page,
        limit,
      };
    } catch (error) {
      console.error('[OrderService] Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Get all orders (for admin)
   */
  async getAllOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Map API response to Order type
      const orders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        userId: order.userId,
        status: order.status || 'pending',
        contactEmail: order.contactEmail,
        deliveryAddress: order.deliveryAddress,
        date: order.date,
        items: (order.products || []).map((product: any) => ({
          id: product.id || '',
          productId: product.productId || '',
          productName: product.productName,
          price: parseFloat(product.price) || 0,
          quantity: product.quantity || 1,
          color: product.color || '',
          size: product.size || '',
          imageUrl: product.imageUrl || '',
          status: order.status || 'Processing',
        })),
        subtotal: order.subtotal || 0,
        totalPrice: order.total || 0,
        orderDate: order.date ? new Date(order.date).toLocaleDateString() : '',
        createdAt: order.date || new Date().toISOString(),
        updatedAt: order.date || new Date().toISOString(),
      }));

      return {
        orders,
        total: orders.length,
        page,
        limit,
      };
    } catch (error) {
      console.error('[OrderService] Error fetching all orders:', error);
      throw error;
    }
  },

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      
      if (!response.ok) {
        return null;
      }

      const order = await response.json();
      
      return {
        id: order.id,
        userId: order.userId,
        status: order.status || 'pending',
        contactEmail: order.contactEmail,
        deliveryAddress: order.deliveryAddress,
        date: order.date,
        items: (order.products || []).map((product: any) => ({
          id: product.id || '',
          productId: product.productId || '',
          productName: product.productName,
          price: parseFloat(product.price) || 0,
          quantity: product.quantity || 1,
          color: product.color || '',
          size: product.size || '',
          imageUrl: product.imageUrl || '',
          status: order.status || 'Processing',
        })),
        subtotal: order.subtotal || 0,
        totalPrice: order.total || 0,
        orderDate: order.date ? new Date(order.date).toLocaleDateString() : '',
        createdAt: order.date || new Date().toISOString(),
        updatedAt: order.date || new Date().toISOString(),
      };
    } catch (error) {
      console.error('[OrderService] Error fetching order:', error);
      return null;
    }
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return this.getOrderById(orderNumber);
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return this.getOrderById(orderId);
    } catch (error) {
      console.error('[OrderService] Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        return null;
      }

      return this.getOrderById(orderId);
    } catch (error) {
      console.error('[OrderService] Error cancelling order:', error);
      return null;
    }
  },

  /**
   * Track order status
   */
  async trackOrder(orderId: string): Promise<{ status: string; estimatedDelivery?: string } | null> {
    try {
      const order = await this.getOrderById(orderId);
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
    } catch (error) {
      console.error('[OrderService] Error tracking order:', error);
      return null;
    }
  },
};
