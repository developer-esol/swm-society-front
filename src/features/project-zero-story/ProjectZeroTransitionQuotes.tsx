import React from 'react';
import { Box, Typography } from '@mui/material';

const quotes = [
  {
    text: "That transition from primary to secondary school is a massive one. We want to help those easily influenced to stay on a positive path.",
    author: '– Omar Beckles',
  },
  {
    text: "Football is a short career. It's vital we upskill and prepare for transitioning.",
    author: '– Omar Beckles',
  },
  {
    text: "Combining football, education, and style speaks to all the things I'm passionate about.",
    author: '– Omar Beckles',
  },
];

export const ProjectZeroTransitionQuotes: React.FC = () => (
  <>
    {quotes.map((q, idx) => (
      <Box key={idx} sx={{ bgcolor: '#f3f4f6', p: 3, my: 2 }}>
        <Typography sx={{ fontStyle: 'italic', mb: 1 }}>{q.text}</Typography>
        <Typography sx={{ fontWeight: 500 }}>{q.author}</Typography>
      </Box>
    ))}
  </>
);
