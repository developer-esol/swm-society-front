import type { CheckoutFormData, CheckoutResponse } from '../../types/checkout';

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
   * Process payment and create order
   * @param formData - Checkout form data with customer and payment information
   * @returns Promise with order confirmation
   */
  async processPayment(formData: CheckoutFormData): Promise<CheckoutResponse> {
    // Simulate payment API call with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (!formData.email || !formData.firstName || !formData.cardNumber) {
      return {
        success: false,
        orderNumber: '',
        message: 'Payment failed. Please check your information.',
      };
    }

    // Mock successful payment
    const orderNumber = `ORD-${Date.now()}`;
    
    return {
      success: true,
      orderNumber,
      message: `Order ${orderNumber} placed successfully! You will receive a confirmation email shortly.`,
    };
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
