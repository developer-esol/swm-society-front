import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../api/services/cartService';
import { checkoutService } from '../../api/services/checkoutService';
import { colors } from '../../theme';
import { checkoutValidationSchema } from './checkoutSchema';
import CheckoutInfo from './CheckoutInfo';
import OrderSummary from './OrderSummary';
import LoyaltyRedemption from './LoyaltyRedemption';
import { PayPalButtonsComponent } from './PayPalButtons';
import type { CheckoutFormData, FormErrors } from '../../types/checkout';
import { useCart } from '../cart/useCart';
import { useAuthStore } from '../../store/useAuthStore';
import { useLoyaltyBalance, useMaxRedeemable, useRedeemPoints } from '../../hooks/useLoyalty';
import { POINT_VALUE } from '../../configs/loyalty';

const CheckoutPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'klarna' | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [creatingPendingOrder, setCreatingPendingOrder] = useState(false);

  // Use the same cart hook as CartPage to ensure consistency
  const { cartItems, isLoading: cartLoading } = useCart();

  // Debug: Watch state changes
  useEffect(() => {
    console.log('[Checkout State] showPaymentSelection:', showPaymentSelection);
  }, [showPaymentSelection]);

  // Debug: watch which payment method selected and auto-scroll to payment section
  useEffect(() => {
    console.log('[Checkout State] selectedPaymentMethod:', selectedPaymentMethod);
    if (selectedPaymentMethod === 'paypal') {
      // small delay to allow DOM render
      setTimeout(() => {
        const el = document.getElementById('payment-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [selectedPaymentMethod]);

  // Calculate totals (no shipping cost)
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const total = Math.max(0, subtotal - loyaltyDiscount); // Apply loyalty discount

  // Fetch loyalty balance and max redeemable
  const { data: loyaltyBalance } = useLoyaltyBalance(user?.id);
  const { data: maxRedeemable } = useMaxRedeemable(subtotal);
  const redeemMutation = useRedeemPoints();

  // Handle loyalty points redemption
  const handleRedeemPoints = async (points: number) => {
    if (points === 0) {
      // Clear discount
      setPointsToRedeem(0);
      setLoyaltyDiscount(0);
      return;
    }

    if (!user?.id) {
      setSubmitError('User not authenticated');
      return;
    }

    try {
      // Calculate discount using POINT_VALUE (currency per 1 point)
      const discount = points * POINT_VALUE;

      // Update local state immediately for UI feedback
      setPointsToRedeem(points);
      setLoyaltyDiscount(discount);
    } catch (error) {
      console.error('Failed to calculate discount:', error);
      setSubmitError('Failed to apply loyalty discount');
    }
  };

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
      console.log('[Checkout] Points to redeem:', pointsToRedeem);
      
      setIsLoading(true);
      setSubmitError(null);

      try {
        // Validate form only, don't create order yet
        console.log('[Checkout] Form validated, showing payment selection');
        
        // Clear any previous errors
        setSubmitError(null);

        // Show payment selection (order will be created after payment)
        setShowPaymentSelection(true);
        setIsLoading(false);
        console.log('[Checkout] Payment selection shown - order will be created after payment');
      } catch (error) {
        console.error('Validation error:', error);
        setSubmitError('Failed to proceed. Please try again.');
        setIsLoading(false);
      }
    },
  });

  // Handle PayPal payment success
  const handlePayPalSuccess = async (paymentDetails: any) => {
    console.log('[Checkout] PayPal payment successful, creating order...', paymentDetails);
    
    try {
      // First, redeem loyalty points if any
      if (pointsToRedeem > 0 && user?.id) {
        console.log('[Checkout] Redeeming loyalty points...');
        await redeemMutation.mutateAsync({
          userId: user.id,
          pointsToRedeem,
          basketTotal: subtotal,
          orderId: paymentDetails.orderId || `temp-${Date.now()}`,
        });
      }

      // Now create the order with PAID status (payment already captured)
      console.log('[Checkout] Creating order with payment details...');
      const result = await checkoutService.processPayment(
        formik.values,
        cartItems,
        subtotal,
        0, // No shipping
        total
      );

      if (!result.success) {
        setSubmitError('Order creation failed after payment. Please contact support.');
        return;
      }

      // Clear cart from local state
      cartService.clearCart();
      
      // Invalidate cart queries to force refresh
      const userId = localStorage.getItem('userId');
      queryClient.invalidateQueries({ queryKey: ['cart', userId || 'anonymous'] });
      
      // Invalidate loyalty balance query
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['loyalty', 'balance', user.id] });
      }
      
      // Dispatch cart-updated event to update cart icon
      window.dispatchEvent(new Event('cart-updated'));

      // Show success message
      setSuccessMessage('Payment completed successfully! Order confirmed.');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('[Checkout] Failed to create order after payment:', error);
      setSubmitError('Payment successful but order creation failed. Please contact support with your payment details.');
    }
  };

  // Handle PayPal payment error
  const handlePayPalError = (error: any) => {
    console.error('[Checkout] PayPal payment error:', error);
    setSubmitError('Payment failed. Please try again or contact support.');
    setSelectedPaymentMethod(null);
  };

  // Handle PayPal payment cancellation
  const handlePayPalCancel = () => {
    console.log('[Checkout] PayPal payment cancelled');
    setSubmitError('Payment was cancelled. You can try again when ready.');
    setSelectedPaymentMethod(null);
  };

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

      {/* Show Payment Selection if order created */}
      {showPaymentSelection ? (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please select your payment method and complete the payment to confirm your order.
          </Alert>

          {!selectedPaymentMethod ? (
            /* Payment Method Selection */
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Choose Payment Method
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.disabled, mb: 1 }}>
                Order Total: <strong>£{total.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.disabled, mb: 4 }}>
                Please select your preferred payment method to complete your order.
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* PayPal Option */}
                <Paper 
                  sx={{ 
                    flex: 1, 
                    p: 3, 
                    cursor: 'pointer',
                    border: '2px solid #0070ba',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    }
                  }}
                  onClick={() => {
                    console.log('[Checkout] PayPal selected');
                    (async () => {
                      console.log('[Checkout] Creating pending order for PayPal...');
                      setCreatingPendingOrder(true);
                      try {
                        const resp = await checkoutService.createPendingOrder(
                          formik.values,
                          cartItems,
                          subtotal,
                          total
                        );
                        if (resp.success && resp.orderId) {
                          console.log('[Checkout] Pending order created:', resp.orderId);
                          setPendingOrderId(resp.orderId);
                          setSelectedPaymentMethod('paypal');
                        } else {
                          console.error('[Checkout] Failed to create pending order:', resp.message);
                          setSubmitError('Failed to create order before payment. Please try again.');
                        }
                      } catch (err) {
                        console.error('[Checkout] Error creating pending order:', err);
                        setSubmitError('Failed to create order before payment. Please try again.');
                      } finally {
                        setCreatingPendingOrder(false);
                      }
                    })();
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0070ba', mb: 1 }}>
                      PayPal
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                      Pay securely with PayPal
                    </Typography>
                  </Box>
                </Paper>

                {/* Klarna Option */}
                <Paper 
                  sx={{ 
                    flex: 1, 
                    p: 3, 
                    cursor: 'pointer',
                    border: '2px solid #FFB3C7',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    }
                  }}
                  onClick={() => {
                    console.log('[Checkout] Klarna selected');
                    setSelectedPaymentMethod('klarna');
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFB3C7', mb: 1 }}>
                      Klarna
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                      Buy now, pay later
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Paper>
          ) : selectedPaymentMethod === 'paypal' ? (
            /* PayPal Payment */
            <Paper id="payment-section" sx={{ p: 4, mb: 3, border: '2px solid #0070ba' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Complete Payment with PayPal
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.disabled, mb: 1 }}>
                Order Total: <strong>£{total.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.disabled, mb: 3 }}>
                Click the PayPal button below to complete your payment securely.
              </Typography>
              <PayPalButtonsComponent
                orderId={pendingOrderId || 'pending-not-ready'}
                amount={total}
                currency="GBP"
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
                onCancel={handlePayPalCancel}
              />
              {creatingPendingOrder && (
                <Typography variant="body2" sx={{ mt: 2 }}>Creating order, please wait...</Typography>
              )}
              <MuiButton
                variant="text"
                onClick={() => setSelectedPaymentMethod(null)}
                sx={{ mt: 2 }}
              >
                ← Choose different payment method
              </MuiButton>
            </Paper>
          ) : (
            /* Klarna Payment (Coming Soon) */
            <Paper sx={{ p: 4, mb: 3, border: '2px solid #FFB3C7' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Klarna Payment
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Klarna payment integration coming soon! Please use PayPal for now.
              </Alert>
              <MuiButton
                variant="contained"
                onClick={() => setSelectedPaymentMethod('paypal')}
                sx={{ mr: 2 }}
              >
                Use PayPal Instead
              </MuiButton>
              <MuiButton
                variant="text"
                onClick={() => setSelectedPaymentMethod(null)}
              >
                ← Back
              </MuiButton>
            </Paper>
          )}

          {/* Order Summary on Payment Page */}
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
            loyaltyDiscount={loyaltyDiscount}
          />
        </Box>
      ) : (
        /* Main Content - Two Column Layout */
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Left Column - Forms */}
          <Box>
            <CheckoutInfo
              formData={formik.values}
              errors={formik.errors as FormErrors}
              onInputChange={handleInputChange}
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
                  
                  // Show error message with details
                  const errorFields = Object.keys(errors).join(', ');
                  setSubmitError(`Please fill in required fields: ${errorFields}`);
                  
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
            {/* Loyalty Points Redemption */}
            {user && loyaltyBalance && maxRedeemable && (
              <LoyaltyRedemption
                availablePoints={loyaltyBalance.availablePoints}
                maxRedeemablePoints={maxRedeemable.maxRedeemablePoints}
                maxDiscountAmount={maxRedeemable.maxDiscountAmount}
                basketTotal={subtotal}
                onRedeem={handleRedeemPoints}
                isLoading={redeemMutation.isPending}
                currentDiscount={loyaltyDiscount}
              />
            )}
            
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              total={total}
              loyaltyDiscount={loyaltyDiscount}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CheckoutPageComponent;
