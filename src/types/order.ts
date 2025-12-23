export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  imageUrl?: string;
  status: 'Shipped' | 'Delivered' | 'Processing' | 'Cancelled';
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateOrderPayload {
  userId?: string;
  items: Array<{
    productId: string;
    productName?: string;
    brandName?: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    imageUrl?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  contactEmail: string;
  shippingAddress?: Record<string, any>;
  paymentMethod?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}
