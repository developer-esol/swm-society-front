import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { colors } from '../../theme';

interface NeedHelpWithReturnProps {
  helpDescription: string;
}

export const NeedHelpWithReturn: React.FC<NeedHelpWithReturnProps> = ({ helpDescription }) => {
  return (
    <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Need Help with a Return?
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: colors.text.lightGray, mb: 4, lineHeight: 1.7 }}
        >
          {helpDescription}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: colors.button.primary,
              color: colors.text.secondary,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.button.primaryHover },
            }}
          >
            Contact Customer Service
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: colors.button.primary,
              borderColor: colors.button.primary,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                borderColor: colors.button.primaryHover,
                color: colors.button.primaryHover,
              },
            }}
          >
            View Shipping Information
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
