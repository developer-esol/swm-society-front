import React from 'react';
import { Typography } from '@mui/material';

interface ThomasMushetSectionTitleProps {
  children: React.ReactNode;
}

export const ThomasMushetSectionTitle: React.FC<ThomasMushetSectionTitleProps> = ({ children }) => (
  <Typography
    variant="h2"
    sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 5, mb: 2 }}
  >
    {children}
  </Typography>
);
