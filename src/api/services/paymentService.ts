import { apiClient } from '../apiClient';

export interface CreatePayPalOrderRequest {
  orderId?: string;
  amount: number;
  currency?: string;
}

export interface CreatePayPalOrderResponse {
  success: boolean;
  paypalOrderId: string;
  orderId: string;
}

export interface CapturePayPalOrderRequest {
  paypalOrderId: string;
  orderId: string;
}

export interface CapturePayPalOrderResponse {
  success: boolean;
  message: string;
  payment: {
    id: string;
    orderId: string;
    paypalOrderId: string;
    paypalTransactionId: string;
    amount: number;
    status: string;
  };
}

export const paymentService = {
  /**
   * Create PayPal order
   */
  async createPayPalOrder(data: CreatePayPalOrderRequest): Promise<CreatePayPalOrderResponse> {
    try {
      const response = await apiClient.post<CreatePayPalOrderResponse>(
        '/payments/create-paypal-order',
        data
      );
      return response;
    } catch (error) {
      console.error('[PaymentService] Failed to create PayPal order:', error);
      throw error;
    }
  },

  /**
   * Capture PayPal payment after user approval
   */
  async capturePayPalOrder(data: CapturePayPalOrderRequest): Promise<CapturePayPalOrderResponse> {
    try {
      const response = await apiClient.post<CapturePayPalOrderResponse>(
        '/payments/capture-paypal-order',
        data
      );
      return response;
    } catch (error) {
      console.error('[PaymentService] Failed to capture PayPal payment:', error);
      throw error;
    }
  },

  /**
   * Get payment details by order ID
   */
  async getPaymentByOrderId(orderId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(`/payments/order/${orderId}`);
      return response;
    } catch (error) {
      console.error('[PaymentService] Failed to get payment details:', error);
      throw error;
    }
  },
};
