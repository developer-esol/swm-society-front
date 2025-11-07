import React from 'react';
import { Typography } from '@mui/material';

interface ProjectZeroSectionTitleProps {
  children: React.ReactNode;
}

export const ProjectZeroSectionTitle: React.FC<ProjectZeroSectionTitleProps> = ({ children }) => (
  <Typography
    variant="h2"
    sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 5, mb: 2 }}
  >
    {children}
  </Typography>
);
