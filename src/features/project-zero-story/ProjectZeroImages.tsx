import React from 'react';
import { Box } from '@mui/material';

export const ProjectZeroImages: React.FC = () => (
  <>
    <Box
      component="img"
      src="/d1.jpg"
      alt="Project ZerO's Collection"
      sx={{ width: '100%', height: 'auto', objectFit: 'cover', my: 4 }}
    />
    <Box
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, my: 4 }}
    >
      <Box
        component="img"
        src="/d2.jpg"
        alt="Project ZerO's Collection"
        sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <Box
        component="img"
        src="/d4.jpg"
        alt="Project ZerO's Collection"
        sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
    </Box>
  </>
);
