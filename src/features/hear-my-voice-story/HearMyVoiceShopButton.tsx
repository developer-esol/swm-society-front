import React from 'react';
import { Box } from '@mui/material';
import { CustomButton } from '../../components/CustomButton';

export const HearMyVoiceShopButton: React.FC = () => (
  <Box sx={{ my: 5, textAlign: 'center' }}>
    <CustomButton
      text="Shop Now"
      sx={{
        bgcolor: '#dc2626',
        color: 'white',
        px: 4,
        py: 1.5,
        fontSize: '1rem',
        '&:hover': {
          bgcolor: '#b91c1c',
        },
      }}
      width="auto"
      height="auto"
      onClick={() => window.location.href = '/shop?collection=Hear%20My%20Voice'}
    />
  </Box>
);
