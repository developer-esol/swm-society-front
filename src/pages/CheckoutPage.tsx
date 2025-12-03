import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../api/services/cartService';
import { checkoutService } from '../api/services/checkoutService';
import { colors } from '../theme';
import type { CheckoutFormData, FormErrors } from '../types/checkout';

// Field styling - no borders, clean appearance
const fieldSx = { 
  '& .MuiOutlinedInput-root': {
    bgcolor: '#ffffff',
    '& fieldset': {
      borderColor: '#e5e7eb'
    },
    '&:hover fieldset': {
      borderColor: '#e5e7eb'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e5e7eb'
    }
  }
};

const selectSx = {
  bgcolor: '#ffffff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb'
  }
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
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
  });

  // Get cart items for order summary
  const cart = cartService.getCart();
  const cartItems = cart.items;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  const validateForm = (): boolean => {
    const newErrors = checkoutService.validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleCardNumberChange = (value: string) => {
    handleInputChange('cardNumber', value);
  };

  const handleCVVChange = (value: string) => {
    handleInputChange('cvv', value);
  };

  const handleCompleteOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Process payment via checkout service
      const result = await checkoutService.processPayment(formData);
      
      if (!result.success) {
        setErrors({ payment: result.message });
        setIsLoading(false);
        return;
      }

      // Clear cart after successful order
      cartService.clearCart();

      // Show success message
      setSuccessMessage(result.message);

      // Reset form
      setFormData({
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
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
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
          <Typography variant="body1" sx={{ color: 'grey.600', mb: 4 }}>
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
          {/* Contact Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => {
                // Validate email on blur only
                const newErrors = { ...errors };
                if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
                  newErrors.email = 'Invalid email format';
                } else {
                  delete newErrors.email;
                }
                setErrors(newErrors);
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
              variant="outlined"
              size="small"
              sx={{ ...fieldSx, mb: 2 }}
            />
          </Box>

          {/* Shipping Address */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Shipping Address
            </Typography>

            {/* First and Last Name */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Box>

            {/* House Number and Apartment */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                label="House Number"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                error={Boolean(errors.houseNumber)}
                helperText={errors.houseNumber}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
              <TextField
                label="Apartment/Flat Name"
                value={formData.apartmentName}
                onChange={(e) => handleInputChange('apartmentName', e.target.value)}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Box>

            {/* Street Name */}
            <TextField
              fullWidth
              label="Street Name"
              value={formData.streetName}
              onChange={(e) => handleInputChange('streetName', e.target.value)}
              error={Boolean(errors.streetName)}
              helperText={errors.streetName}
              variant="outlined"
              size="small"
              sx={{ ...fieldSx, mb: 2 }}
            />

            {/* City and Postal Code */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={Boolean(errors.city)}
                helperText={errors.city}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
              <TextField
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Box>

            {/* Country */}
            <Select
              fullWidth
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              variant="outlined"
              size="small"
              sx={{ ...selectSx, mb: 2 }}
            >
              <MenuItem value="United Kingdom">United Kingdom</MenuItem>
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="Australia">Australia</MenuItem>
              <MenuItem value="France">France</MenuItem>
              <MenuItem value="Germany">Germany</MenuItem>
              <MenuItem value="Italy">Italy</MenuItem>
              <MenuItem value="Spain">Spain</MenuItem>
            </Select>
          </Box>

          {/* Payment Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Payment Information
            </Typography>

            {/* Payment Method and Card Fields - Side by Side Layout */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 5, alignItems: 'flex-start' }}>
              {/* Left: Payment Method Selection */}
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={{ color: 'grey.600', display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    🔒 Secure payment processing
                  </Typography>
                </Box>
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'credit' | 'cash')}
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel
                    value="credit"
                    control={<Radio sx={{ mr: 1.5, color: '#dc2626', '&.Mui-checked': { color: '#dc2626' } }} />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>
                        Credit / Debit Card
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    value="cash"
                    control={<Radio sx={{ mr: 1.5, color: '#dc2626', '&.Mui-checked': { color: '#dc2626' } }} />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>
                        Cash On Delivery
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </RadioGroup>
              </Box>

              {/* Right: Credit Card Fields - Gray Background Box */}
              {formData.paymentMethod === 'credit' && (
                <Box sx={{ bgcolor: '#f3f4f6', p: 4, borderRadius: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'grey.700', mb: 1 }}>
                      Name on Card
                    </Typography>
                    <TextField
                      fullWidth
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      error={Boolean(errors.cardName)}
                      helperText={errors.cardName}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#e5e7eb'
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb'
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'grey.700', mb: 1 }}>
                      Card Number
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      error={Boolean(errors.cardNumber)}
                      helperText={errors.cardNumber}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#e5e7eb'
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb'
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Expiry and CVV */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.700', mb: 1 }}>
                        Month
                      </Typography>
                      <Select
                        fullWidth
                        value={formData.expiryMonth}
                        onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                        error={Boolean(errors.expiryMonth)}
                        variant="outlined"
                        size="small"
                        sx={{
                          bgcolor: '#ffffff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          }
                        }}
                      >
                        <MenuItem value="MM">MM</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.700', mb: 1 }}>
                        Year
                      </Typography>
                      <Select
                        fullWidth
                        value={formData.expiryYear}
                        onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                        error={Boolean(errors.expiryYear)}
                        variant="outlined"
                        size="small"
                        sx={{
                          bgcolor: '#ffffff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e5e7eb'
                          }
                        }}
                      >
                        <MenuItem value="YY">YY</MenuItem>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <MenuItem key={year} value={String(year).slice(-2)}>
                              {String(year).slice(-2)}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.700', mb: 1 }}>
                        CVV
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="XXX"
                        value={formData.cvv}
                        onChange={(e) => handleCVVChange(e.target.value)}
                        error={Boolean(errors.cvv)}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#ffffff',
                            '& fieldset': {
                              borderColor: '#e5e7eb'
                            },
                            '&:hover fieldset': {
                              borderColor: '#e5e7eb'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#e5e7eb'
                            }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Complete Order Button */}
          <MuiButton
            fullWidth
            variant="contained"
            onClick={handleCompleteOrder}
            disabled={isLoading || cartItems.length === 0}
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#ffffff',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : 'Complete Order'}
          </MuiButton>
        </Box>

        {/* Right Column - Order Summary */}
        <Box>
          <Paper sx={{ p: 3, bgcolor: '#f9fafb', position: 'sticky', top: 100 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Summary
            </Typography>

            {/* Order Items */}
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'grey.600' }}>
                    Qty: {item.quantity} × £{item.price.toFixed(2)}
                  </Typography>
                  {item.color && (
                    <Typography variant="caption" sx={{ color: 'grey.600', display: 'block' }}>
                      Color: {item.color}
                    </Typography>
                  )}
                  {item.size && (
                    <Typography variant="caption" sx={{ color: 'grey.600', display: 'block' }}>
                      Size: {item.size}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Pricing Details */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'grey.600' }}>
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  £{subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'grey.600' }}>
                  Shipping
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  £{shipping.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.button.primary }}>
                £{total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
