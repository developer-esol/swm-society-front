import React, { useState } from 'react';
import { POINT_VALUE } from '../../configs/loyalty';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Slider,
  CircularProgress,
} from '@mui/material';
import { Stars } from '@mui/icons-material';
import { colors } from '../../theme';

interface LoyaltyRedemptionProps {
  availablePoints: number;
  maxRedeemablePoints: number;
  maxDiscountAmount: number;
  basketTotal: number;
  onRedeem: (points: number) => void;
  isLoading?: boolean;
  currentDiscount: number;
}

const LoyaltyRedemption: React.FC<LoyaltyRedemptionProps> = ({
  availablePoints,
  maxRedeemablePoints,
  maxDiscountAmount,
  onRedeem,
  isLoading = false,
  currentDiscount,
}) => {
  const [pointsInput, setPointsInput] = useState(0);
  const [error, setError] = useState('');

  // Calculate discount amount using POINT_VALUE (currency per 1 point)
  const discountAmount = pointsInput * POINT_VALUE;

  // Max points user can redeem (lesser of available or max allowed)
  const maxPoints = Math.min(availablePoints, maxRedeemablePoints);

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const points = value as number;
    setPointsInput(points);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value > maxPoints) {
      setError(`Maximum ${maxPoints} points can be redeemed`);
      setPointsInput(maxPoints);
    } else if (value < 0) {
      setPointsInput(0);
    } else {
      setPointsInput(value);
      setError('');
    }
  };

  const handleApply = () => {
    if (pointsInput <= 0) {
      setError('Please enter points to redeem');
      return;
    }
    if (pointsInput > maxPoints) {
      setError(`Maximum ${maxPoints} points can be redeemed`);
      return;
    }
    onRedeem(pointsInput);
  };

  const handleClear = () => {
    setPointsInput(0);
    setError('');
    onRedeem(0);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: colors.background.light, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Stars sx={{ color: '#FFD700', fontSize: '1.5rem' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Loyalty Points
        </Typography>
      </Box>

      {/* Available Points */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: colors.text.disabled, mb: 0.5 }}>
          Available: <strong>{availablePoints.toLocaleString()} points</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.disabled }}>
          Max redeemable: <strong>{maxPoints.toLocaleString()} points</strong> (£{maxDiscountAmount.toFixed(2)})
        </Typography>
      </Box>

      {availablePoints > 0 && maxPoints > 0 ? (
        <>
          {/* Slider */}
          <Box sx={{ mb: 2 }}>
            <Slider
              value={pointsInput}
              onChange={handleSliderChange}
              min={0}
              max={maxPoints}
              step={10}
              marks={[
                { value: 0, label: '0' },
                { value: maxPoints, label: maxPoints.toLocaleString() },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} pts`}
              sx={{
                color: colors.button.primary,
                '& .MuiSlider-thumb': {
                  bgcolor: colors.button.primary,
                },
                '& .MuiSlider-track': {
                  bgcolor: colors.button.primary,
                },
              }}
            />
          </Box>

          {/* Input Field */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              type="number"
              value={pointsInput || ''}
              onChange={handleInputChange}
              placeholder="Enter points"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0, max: maxPoints },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={isLoading || pointsInput <= 0 || pointsInput > maxPoints}
              sx={{
                minWidth: '100px',
                bgcolor: colors.button.primary,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Apply'}
            </Button>
          </Box>

          {/* Clear Button */}
          {currentDiscount > 0 && (
            <Button
              variant="outlined"
              onClick={handleClear}
              fullWidth
              size="small"
              sx={{
                mb: 2,
                color: colors.text.disabled,
                borderColor: colors.border.default,
                '&:hover': {
                  borderColor: colors.text.disabled,
                  bgcolor: colors.background.lighter,
                },
              }}
            >
              Clear Loyalty Discount
            </Button>
          )}

          {/* Discount Preview */}
          {pointsInput > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Redeeming {pointsInput.toLocaleString()} points = £{discountAmount.toFixed(2)} discount
            </Alert>
          )}

          {/* Current Discount Applied */}
          {currentDiscount > 0 && (
            <Alert severity="info">
              Current discount applied: £{currentDiscount.toFixed(2)}
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </>
      ) : (
        <Alert severity="info">
          {availablePoints === 0
            ? 'No loyalty points available'
            : 'Basket total too low to redeem points'}
        </Alert>
      )}
    </Paper>
  );
};

export default LoyaltyRedemption;
