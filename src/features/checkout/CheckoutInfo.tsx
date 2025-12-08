import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { colors } from '../../theme';
import type { CheckoutFormData, FormErrors } from '../../types/checkout';

interface CheckoutInfoProps {
  formData: CheckoutFormData;
  errors: FormErrors;
  onInputChange: (field: keyof CheckoutFormData, value: string) => void;
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

const CheckoutInfo: React.FC<CheckoutInfoProps> = ({ formData, errors, onInputChange }) => {
  const handleEmailBlur = () => {
    // Validate email on blur only
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      // Error will be displayed by parent
    }
  };

  return (
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
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={handleEmailBlur}
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
            onChange={(e) => onInputChange('firstName', e.target.value)}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            variant="outlined"
            size="small"
            sx={fieldSx}
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
            onChange={(e) => onInputChange('houseNumber', e.target.value)}
            error={Boolean(errors.houseNumber)}
            helperText={errors.houseNumber}
            variant="outlined"
            size="small"
            sx={fieldSx}
          />
          <TextField
            label="Apartment/Flat Name"
            value={formData.apartmentName}
            onChange={(e) => onInputChange('apartmentName', e.target.value)}
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
          onChange={(e) => onInputChange('streetName', e.target.value)}
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
            onChange={(e) => onInputChange('city', e.target.value)}
            error={Boolean(errors.city)}
            helperText={errors.city}
            variant="outlined"
            size="small"
            sx={fieldSx}
          />
          <TextField
            label="Postal Code"
            value={formData.postalCode}
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            error={Boolean(errors.postalCode)}
            helperText={errors.postalCode}
            variant="outlined"
            size="small"
            sx={{ ...fieldSx, mb: 2 }}
          />
        </Box>

        {/* Country */}
        <Select
          fullWidth
          value={formData.country}
          onChange={(e) => onInputChange('country', e.target.value)}
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
    </Box>
  );
};

export default CheckoutInfo;
