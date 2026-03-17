import type { CheckoutFormData, CheckoutResponse } from '../../types/checkout';
import type { CartItem } from '../../types/cart';
import { apiClient } from '../apiClient';

// Validation Patterns
const PATTERNS = {
  EMAIL: /^\S+@\S+\.\S+$/,
  TEXT_ONLY: /^[a-zA-Z\s'-]+$/,
  ALPHANUMERIC: /^[0-9a-zA-Z\s-]+$/,
  DIGITS_16: /^\d{16}$/,
  DIGITS_3_4: /^\d{3,4}$/,
};

// Validation Messages
const MESSAGES = {
  REQUIRED: 'is required',
  INVALID_FORMAT: 'Invalid format',
  INVALID_EMAIL: 'Invalid email format',
  LETTERS_ONLY: 'can only contain letters',
  CARD_NUMBER: 'Card number must be 16 digits',
  CVV: 'CVV must be 3-4 digits',
};

export const checkoutService = {
  /**
   * Create PENDING order for PayPal payment
   * @param formData - Checkout form data with customer information
   * @param cartItems - Items in the cart
   * @param subtotal - Subtotal amount
   * @param total - Total amount after discounts
   * @returns Promise with orderId
   */
  async createPendingOrder(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    subtotal: number,
    total: number
  ): Promise<{ success: boolean; orderId: string; message: string }> {
    try {
      // Get the NestJS user UUID
      const springBootUserId = localStorage.getItem('userId');
      
      if (!springBootUserId) {
        throw new Error('User not authenticated');
      }

      // Convert Spring Boot ID to NestJS UUID
      let nestJsUserId: string;
      
      if (springBootUserId.includes('-')) {
        nestJsUserId = springBootUserId;
      } else {
        try {
          const users = await fetch(`http://localhost:3000/users?externalId=${springBootUserId}`).then(r => r.json());
          if (users && users.length > 0 && users[0].id) {
            nestJsUserId = users[0].id;
          } else {
            throw new Error('User not found in NestJS database');
          }
        } catch (error) {
          console.error('[CheckoutService] Failed to get NestJS UUID:', error);
          throw new Error('Failed to process checkout. Please try again.');
        }
      }

      // Map cart items to order items format
      const items = cartItems.map(item => ({
        productId: item.productId,
        brandName: item.brandName || 'Unknown',
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        size: item.size,
        color: item.color,
        imageUrl: item.productImage,
      }));

      // Prepare checkout payload
      const checkoutPayload = {
        userId: nestJsUserId,
        contactEmail: formData.email,
        deliveryAddress: {
          houseNumber: formData.houseNumber,
          apartmentName: formData.apartmentName || '',
          streetName: formData.streetName,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items,
        subtotal,
        total,
      };

      console.log('[CheckoutService] Creating PENDING order:', checkoutPayload);

      // Call the checkout API
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(checkoutPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();

      console.log('[CheckoutService] PENDING order created:', data);
      
      // Backend returns: { success: true, data: { order: { id: "..." } } }
      const orderId = data.data?.order?.id || data.order?.id || data.orderId || data.id;
      console.log('[CheckoutService] Extracted orderId:', orderId);

      return {
        success: true,
        orderId: orderId,
        message: data.message || 'Order created successfully',
      };
    } catch (error) {
      console.error('[CheckoutService] Failed to create PENDING order:', error);
      
      const errorMessage = (error as any)?.response?.data?.message || 
                          (error as any)?.message || 
                          'Failed to create order. Please try again.';

      return {
        success: false,
        orderId: '',
        message: errorMessage,
      };
    }
  },

  /**
   * Process payment and create order
   * @param formData - Checkout form data with customer and payment information
   * @param cartItems - Items in the cart to checkout
   * @param subtotal - Subtotal amount
   * @param shippingCost - Shipping cost
   * @param total - Total amount
   * @returns Promise with order confirmation
   */
  async processPayment(
    formData: CheckoutFormData,
    cartItems: CartItem[],
    subtotal: number,
    shippingCost: number,
    total: number
  ): Promise<CheckoutResponse> {
    try {
      // Get the NestJS user UUID (not Spring Boot externalId)
      const springBootUserId = localStorage.getItem('userId');
      
      if (!springBootUserId) {
        throw new Error('User not authenticated');
      }

      // Convert Spring Boot ID to NestJS UUID
      let nestJsUserId: string;
      
      // Check if userId is already a UUID format (contains hyphens)
      if (springBootUserId.includes('-')) {
        nestJsUserId = springBootUserId;
      } else {
        // Fetch NestJS user UUID from Spring Boot externalId
        try {
          const users = await fetch(`http://localhost:3000/users?externalId=${springBootUserId}`).then(r => r.json());
          if (users && users.length > 0 && users[0].id) {
            nestJsUserId = users[0].id;
          } else {
            throw new Error('User not found in NestJS database');
          }
        } catch (error) {
          console.error('[CheckoutService] Failed to get NestJS UUID:', error);
          throw new Error('Failed to process checkout. Please try again.');
        }
      }

      console.log('[CheckoutService] Using NestJS UUID:', nestJsUserId);

      // Map cart items to order items format
      const items = cartItems.map(item => ({
        productId: item.productId,  // ✅ Required for stock reduction
        brandName: item.brandName || 'Unknown',
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        size: item.size,
        color: item.color,
        imageUrl: item.productImage,
      }));

      // Calculate subtotal and total
      const calculatedSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      const calculatedTotal = calculatedSubtotal; // No shipping cost

      // Prepare checkout payload with subtotal and total
      const checkoutPayload = {
        userId: nestJsUserId,
        contactEmail: formData.email,
        deliveryAddress: {
          houseNumber: formData.houseNumber,
          apartmentName: formData.apartmentName || '',
          streetName: formData.streetName,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items,
        subtotal: calculatedSubtotal,
        total: calculatedTotal,
      };

      console.log('[CheckoutService] Processing checkout:', checkoutPayload);

      // Call the checkout API directly (NestJS on port 3000)
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(checkoutPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();

      console.log('[CheckoutService] Checkout successful:', data);

      return {
        success: true,
        orderNumber: data.orderId || `ORD-${Date.now()}`,
        message: data.message || 'Order placed successfully!',
      };
    } catch (error) {
      console.error('[CheckoutService] Checkout failed:', error);
      
      const errorMessage = (error as any)?.response?.data?.message || 
                          (error as any)?.message || 
                          'Payment failed. Please try again.';

      return {
        success: false,
        orderNumber: '',
        message: errorMessage,
      };
    }
  },

  /**
   * Validate checkout form data
   * Validates in order: Contact -> Shipping -> Payment
   */
  validateForm(formData: CheckoutFormData): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // ===== CONTACT INFORMATION =====
    this.validateEmail(formData.email, errors);

    // ===== SHIPPING ADDRESS =====
    this.validateFirstName(formData.firstName, errors);
    this.validateLastName(formData.lastName, errors);
    this.validateHouseNumber(formData.houseNumber, errors);
    this.validateStreetName(formData.streetName, errors);
    this.validateCity(formData.city, errors);
    this.validatePostalCode(formData.postalCode, errors);
    this.validateCountry(formData.country, errors);

    // ===== PAYMENT INFORMATION =====
    if (formData.paymentMethod === 'credit') {
      this.validateCardName(formData.cardName, errors);
      this.validateCardNumber(formData.cardNumber, errors);
      this.validateExpiryMonth(formData.expiryMonth, errors);
      this.validateExpiryYear(formData.expiryYear, errors);
      this.validateCVV(formData.cvv, errors);
    }

    return errors;
  },

  // ===== INDIVIDUAL VALIDATION METHODS =====

  validateEmail(email: string, errors: { [key: string]: string }): void {
    if (!email) {
      errors.email = `Email ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.EMAIL.test(email)) {
      errors.email = MESSAGES.INVALID_EMAIL;
    }
  },

  validateFirstName(firstName: string, errors: { [key: string]: string }): void {
    if (!firstName) {
      errors.firstName = `First name ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.TEXT_ONLY.test(firstName)) {
      errors.firstName = `First name ${MESSAGES.LETTERS_ONLY}`;
    }
  },

  validateLastName(lastName: string, errors: { [key: string]: string }): void {
    if (!lastName) {
      errors.lastName = `Last name ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.TEXT_ONLY.test(lastName)) {
      errors.lastName = `Last name ${MESSAGES.LETTERS_ONLY}`;
    }
  },

  validateHouseNumber(houseNumber: string, errors: { [key: string]: string }): void {
    if (!houseNumber) {
      errors.houseNumber = `House number ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.ALPHANUMERIC.test(houseNumber)) {
      errors.houseNumber = `House number ${MESSAGES.INVALID_FORMAT}`;
    }
  },

  validateStreetName(streetName: string, errors: { [key: string]: string }): void {
    if (!streetName) {
      errors.streetName = `Street name ${MESSAGES.REQUIRED}`;
    }
  },

  validateCity(city: string, errors: { [key: string]: string }): void {
    if (!city) {
      errors.city = `City ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.TEXT_ONLY.test(city)) {
      errors.city = `City ${MESSAGES.LETTERS_ONLY}`;
    }
  },

  validatePostalCode(postalCode: string, errors: { [key: string]: string }): void {
    if (!postalCode) {
      errors.postalCode = `Postal code ${MESSAGES.REQUIRED}`;
    }
  },

  validateCountry(country: string, errors: { [key: string]: string }): void {
    if (!country) {
      errors.country = `Country ${MESSAGES.REQUIRED}`;
    }
  },

  validateCardName(cardName: string, errors: { [key: string]: string }): void {
    if (!cardName) {
      errors.cardName = `Card name ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.TEXT_ONLY.test(cardName)) {
      errors.cardName = `Card name ${MESSAGES.LETTERS_ONLY}`;
    }
  },

  validateCardNumber(cardNumber: string, errors: { [key: string]: string }): void {
    if (!cardNumber) {
      errors.cardNumber = `Card number ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.DIGITS_16.test(cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = MESSAGES.CARD_NUMBER;
    }
  },

  validateExpiryMonth(expiryMonth: string, errors: { [key: string]: string }): void {
    if (expiryMonth === 'MM') {
      errors.expiryMonth = `Month ${MESSAGES.REQUIRED}`;
    }
  },

  validateExpiryYear(expiryYear: string, errors: { [key: string]: string }): void {
    if (expiryYear === 'YY') {
      errors.expiryYear = `Year ${MESSAGES.REQUIRED}`;
    }
  },

  validateCVV(cvv: string, errors: { [key: string]: string }): void {
    if (!cvv) {
      errors.cvv = `CVV ${MESSAGES.REQUIRED}`;
    } else if (!PATTERNS.DIGITS_3_4.test(cvv)) {
      errors.cvv = MESSAGES.CVV;
    }
  },
};
