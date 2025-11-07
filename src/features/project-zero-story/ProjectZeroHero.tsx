import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProjectZeroHero: React.FC = () => (
  <Box sx={{ bgcolor: 'white', width: '100%' }}>
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '1.875rem', md: '2.25rem' },
        fontWeight: 'bold',
        mb: 4,
        textAlign: 'center',
      }}
    >
      SWMSOCIETY PRESENTS: PROJECT ZER0'S
    </Typography>
  </Box>
);
