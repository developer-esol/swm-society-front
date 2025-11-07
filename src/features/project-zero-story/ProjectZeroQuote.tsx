import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProjectZeroQuoteProps {
  quote: string;
  author: string;
}

export const ProjectZeroQuote: React.FC<ProjectZeroQuoteProps> = ({ quote, author }) => (
  <Box sx={{ bgcolor: '#f3f4f6', p: 3, my: 4, borderLeft: '4px solid #dc2626' }}>
    <Typography sx={{ fontStyle: 'italic', mb: 1 }}>{quote}</Typography>
    <Typography sx={{ fontWeight: 500 }}>{author}</Typography>
  </Box>
);
