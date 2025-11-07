import React from 'react';
import { Box } from '@mui/material';

export const ThomasMushetImage: React.FC = () => (
  <Box
    component="img"
    src="/B2.webp"
    alt="Thomas Mushet Collection"
    sx={{ width: '100%', height: 'auto', objectFit: 'cover', my: 4 }}
  />
);
