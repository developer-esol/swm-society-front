import React from 'react';
import { Box } from '@mui/material';

export const HearMyVoiceImage: React.FC = () => (
  <Box
    component="img"
    src="/b3.jpg"
    alt="Hear My Voice Collection"
    sx={{ width: '100%', height: 'auto', objectFit: 'cover', my: 4 }}
  />
);
