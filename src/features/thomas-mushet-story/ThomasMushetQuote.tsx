import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme';


export const ThomasMushetQuote: React.FC = () => (
  <Box sx={{ bgcolor: colors.background.lighter, p: 3, my: 4, borderLeft: '4px solid #2563eb' }}>
    <Typography sx={{ fontStyle: 'italic' }}>
      "Fashion and sports have always been intertwined. The Thomas Mushet collection celebrates this connection, bringing the energy of the game into everyday style."
    </Typography>
  </Box>
);
