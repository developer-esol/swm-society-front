import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme';


interface ProjectZeroQuoteProps {
  quote: string;
  author: string;
}

export const ProjectZeroQuote: React.FC<ProjectZeroQuoteProps> = ({ quote, author }) => (
  <Box sx={{ bgcolor: colors.background.lighter, p: 3, my: 4, borderLeft: '4px solid colors.button.primary' }}>
    <Typography sx={{ fontStyle: 'italic', mb: 1 }}>{quote}</Typography>
    <Typography sx={{ fontWeight: 500 }}>{author}</Typography>
  </Box>
);
