import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { cartService } from '../../api/services/cartService';
import { checkoutService } from '../../api/services/checkoutService';
import { colors } from '../../theme';
import { checkoutValidationSchema } from './checkoutSchema';
import CheckoutInfo from './CheckoutInfo';
import PaymentInfo from './PaymentInfo';
import OrderSummary from './OrderSummary';
import type { CheckoutFormData, FormErrors } from '../../types/checkout';

const CheckoutPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get cart items for order summary
  const cart = cartService.getCart();
  const cartItems = cart.items;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  const formik = useFormik<CheckoutFormData>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      houseNumber: '',
      apartmentName: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: 'United Kingdom',
      paymentMethod: 'credit',
      cardName: '',
      cardNumber: '',
      expiryMonth: 'MM',
      expiryYear: 'YY',
      cvv: '',
    },
    validationSchema: checkoutValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setSubmitError(null);

      try {
        // Process payment via checkout service
        const result = await checkoutService.processPayment(values);
        
        if (!result.success) {
          setSubmitError(result.message);
          setIsLoading(false);
          return;
        }

        // Clear cart after successful order
        cartService.clearCart();

        // Show success message
        setSuccessMessage(result.message);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Payment error:', error);
        setSubmitError('Payment processing failed. Please try again.');
        setIsLoading(false);
      }
    },
  });

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    // Validate and filter input based on field type
    let processedValue = value;

    // Text fields - letters, spaces, hyphens, apostrophes only
    if (field === 'firstName' || field === 'lastName' || field === 'city' || field === 'cardName') {
      processedValue = value.replace(/[^a-zA-Z\s'-]/g, '');
    }
    // House number - alphanumeric, spaces, hyphens
    else if (field === 'houseNumber') {
      processedValue = value.replace(/[^0-9a-zA-Z\s-]/g, '');
    }
    // Card number - digits only, max 16
    else if (field === 'cardNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 16);
    }
    // CVV - digits only, max 4
    else if (field === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    formik.setFieldValue(field, processedValue);
  };

  const handleCardNumberChange = (value: string) => {
    handleInputChange('cardNumber', value);
  };

  const handleCVVChange = (value: string) => {
    handleInputChange('cvv', value);
  };

  if (successMessage) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Order Confirmed! 🎉
          </Typography>
          <Alert severity="success" sx={{ mb: 4 }}>
            {successMessage}
          </Alert>
          <Typography variant="body1" sx={{ color: colors.text.disabled, mb: 4 }}>
            Redirecting to home page...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Checkout
      </Typography>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Left Column - Forms */}
        <Box>
          <CheckoutInfo
            formData={formik.values}
            errors={formik.touched as unknown as FormErrors}
            onInputChange={handleInputChange}
          />

          <PaymentInfo
            formData={formik.values}
            errors={formik.touched as unknown as FormErrors}
            onInputChange={handleInputChange}
            onCardNumberChange={handleCardNumberChange}
            onCVVChange={handleCVVChange}
          />

          {/* Submit Error */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          {/* Complete Order Button */}
          <MuiButton
            fullWidth
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading || cartItems.length === 0}
            sx={{
              backgroundColor: colors.overlay.dark,
              color: colors.text.secondary,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: colors.overlay.darkHover,
              },
              '&:disabled': {
                backgroundColor: colors.overlay.gray,
                color: colors.text.secondary,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : 'Complete Order'}
          </MuiButton>
        </Box>

        {/* Right Column - Order Summary */}
        <Box>
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPageComponent;
