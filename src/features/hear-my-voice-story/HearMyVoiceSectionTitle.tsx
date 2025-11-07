import React from 'react';
import { Typography } from '@mui/material';

interface HearMyVoiceSectionTitleProps {
  children: React.ReactNode;
}

export const HearMyVoiceSectionTitle: React.FC<HearMyVoiceSectionTitleProps> = ({ children }) => (
  <Typography
    variant="h2"
    sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 5, mb: 2 }}
  >
    {children}
  </Typography>
);
