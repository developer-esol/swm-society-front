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
// import PaymentInfo from './PaymentInfo';
import OrderSummary from './OrderSummary';
import type { CheckoutFormData, FormErrors } from '../../types/checkout';
import { useCart } from '../cart/useCart';

const CheckoutPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Use the same cart hook as CartPage to ensure consistency
  const { cartItems, isLoading: cartLoading } = useCart();

  // Calculate totals (no shipping cost)
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const total = subtotal; // Total is same as subtotal (no shipping)

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
      paymentMethod: 'cash', // Default to cash - no payment processing
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
    validationSchema: checkoutValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log('[Checkout] Form submitted with values:', values);
      console.log('[Checkout] Cart items:', cartItems.length, 'items');
      
      setIsLoading(true);
      setSubmitError(null);

      try {
        console.log('[Checkout] Calling processPayment...');
        // Process payment via checkout service with cart items and totals
        const result = await checkoutService.processPayment(
          values,
          cartItems,
          subtotal,
          0, // No shipping cost
          total
        );
        
        console.log('[Checkout] Result:', result);
        
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

  // Show loading state while fetching cart
  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
            errors={formik.errors as FormErrors}
            onInputChange={handleInputChange}
          />

          {/* <PaymentInfo
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
            onClick={async () => {
              console.log('[Checkout] Button clicked');
              console.log('[Checkout] Form values:', formik.values);
              console.log('[Checkout] Form errors:', formik.errors);
              console.log('[Checkout] Is valid:', formik.isValid);
              console.log('[Checkout] Cart items:', cartItems.length);
              
              // Manually trigger validation
              const errors = await formik.validateForm();
              console.log('[Checkout] Validation errors:', errors);
              
              if (Object.keys(errors).length > 0) {
                console.error('[Checkout] Form has validation errors:', errors);
                formik.setTouched({
                  email: true,
                  firstName: true,
                  lastName: true,
                  houseNumber: true,
                  streetName: true,
                  city: true,
                  postalCode: true,
                  country: true,
                });
                return;
              }
              
              formik.handleSubmit();
            }}
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
            total={total}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPageComponent;
