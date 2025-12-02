export interface CheckoutFormData {
  // Contact Information
  email: string;
  // Shipping Address
  firstName: string;
  lastName: string;
  houseNumber: string;
  apartmentName: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  // Payment Information
  paymentMethod: 'credit' | 'cash';
  cardName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderNumber: string;
  message: string;
}
