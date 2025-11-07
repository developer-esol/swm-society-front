import React from 'react';
import { Box, Typography } from '@mui/material';

export const HearMyVoiceQuote: React.FC = () => (
  <Box sx={{ bgcolor: '#f3f4f6', p: 3, my: 4, borderLeft: '4px solid #4f46e5' }}>
    <Typography sx={{ fontStyle: 'italic' }}>
      "Fashion has always been a form of self-expression. The Hear My Voice collection takes this to another level, creating pieces that not only look good but say something meaningful."
    </Typography>
  </Box>
);
