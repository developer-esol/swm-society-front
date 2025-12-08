import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { colors } from '../../theme';

interface ExchangesProps {
  exchangesDescription: string;
}

export const Exchanges: React.FC<ExchangesProps> = ({ exchangesDescription }) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Exchanges
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.text.lightGray, mb: 3, lineHeight: 1.7 }}
          >
            {exchangesDescription}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
