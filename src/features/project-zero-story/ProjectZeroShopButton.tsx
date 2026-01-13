import React from 'react';
import { Box } from '@mui/material';
import { CustomButton } from '../../components/CustomButton';
import { colors } from '../../theme';


export const ProjectZeroShopButton: React.FC = () => (
  <Box sx={{ my: 5, textAlign: 'center' }}>
    <CustomButton
      text="Shop Now"
      sx={{
        bgcolor: colors.button.primary,
        color: 'white',
        px: 4,
        py: 1.5,
        fontSize: '1rem',
        '&:hover': {
          bgcolor: colors.button.primaryHover,
        },
      }}
      width="auto"
      height="auto"
      onClick={() => window.location.href = '/shop'}
    />
  </Box>
);
