import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
} from '@mui/material';
import { colors } from '../../theme';
import type { CheckoutFormData, FormErrors } from '../../types/checkout';

interface PaymentInfoProps {
  formData: CheckoutFormData;
  errors: FormErrors;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
  onCardNumberChange: (value: string) => void;
  onCVVChange: (value: string) => void;
}

const fieldSx = { 
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.input.bg,
    '& fieldset': {
      borderColor: colors.border.default
    },
    '&:hover fieldset': {
      borderColor: colors.border.default
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.border.default
    }
  }
};

const selectSx = {
  bgcolor: colors.input.bg,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default
  }
};

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  formData,
  errors,
  onInputChange,
  onCardNumberChange,
  onCVVChange,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Payment Information
      </Typography>

      {/* Payment Method and Card Fields - Side by Side Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 5, alignItems: 'flex-start' }}>
        {/* Left: Payment Method Selection */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              🔒 Secure payment processing
            </Typography>
          </Box>
          <RadioGroup
            value={formData.paymentMethod}
            onChange={(e) => onInputChange('paymentMethod', e.target.value)}
            sx={{ gap: 2 }}
          >
            <FormControlLabel
              value="credit"
              control={<Radio sx={{ mr: 1.5, color: colors.button.primary, '&.Mui-checked': { color: colors.button.primary } }} />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.dark, whiteSpace: 'nowrap' }}>
                  Credit / Debit Card
                </Typography>
              }
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="cash"
              control={<Radio sx={{ mr: 1.5, color: colors.button.primary, '&.Mui-checked': { color: colors.button.primary } }} />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.dark, whiteSpace: 'nowrap' }}>
                  Cash On Delivery
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </RadioGroup>
        </Box>

        {/* Right: Credit Card Fields - Gray Background Box */}
        {formData.paymentMethod === 'credit' && (
          <Box sx={{ bgcolor: colors.background.lighter, p: 4, borderRadius: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: colors.text.gray, mb: 1 }}>
                Name on Card
              </Typography>
              <TextField
                fullWidth
                value={formData.cardName}
                onChange={(e) => onInputChange('cardName', e.target.value)}
                error={Boolean(errors.cardName)}
                helperText={errors.cardName}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: colors.text.gray, mb: 1 }}>
                Card Number
              </Typography>
              <TextField
                fullWidth
                placeholder="XXXX XXXX XXXX XXXX"
                value={formData.cardNumber}
                onChange={(e) => onCardNumberChange(e.target.value)}
                error={Boolean(errors.cardNumber)}
                helperText={errors.cardNumber}
                variant="outlined"
                size="small"
                sx={fieldSx}
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
                  onChange={(e) => onInputChange('expiryMonth', e.target.value)}
                  error={Boolean(errors.expiryMonth)}
                  variant="outlined"
                  size="small"
                  sx={selectSx}
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
                  onChange={(e) => onInputChange('expiryYear', e.target.value)}
                  error={Boolean(errors.expiryYear)}
                  variant="outlined"
                  size="small"
                  sx={selectSx}
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
                  onChange={(e) => onCVVChange(e.target.value)}
                  error={Boolean(errors.cvv)}
                  variant="outlined"
                  size="small"
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentInfo;
