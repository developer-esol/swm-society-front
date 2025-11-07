import React from 'react';
import { Box, Typography } from '@mui/material';

const quotes = [
  {
    text: "Fortunately enough as footballers, we've been given a platform. It's only right we use it in a purposeful way.",
    author: '– Omar Beckles',
  },
  {
    text: "There's enough bad role models out there… it's good to paint a picture of some positive ones.",
    author: '– Omar Beckles',
  },
  {
    text: "I lost a good friend of mine, a Sunday league teammate and raw talent, to knife crime. The last thing we want is for anyone else to go through that.",
    author: '– Omar Beckles',
  },
  {
    text: "I really believe in collaborations. The power of different organisations coming together can impact lives.",
    author: '– Omar Beckles',
  },
];

export const ProjectZeroMentorshipQuotes: React.FC = () => (
  <>
    {quotes.map((q, idx) => (
      <Box key={idx} sx={{ bgcolor: '#f3f4f6', p: 3, my: 2 }}>
        <Typography sx={{ fontStyle: 'italic', mb: 1 }}>{q.text}</Typography>
        <Typography sx={{ fontWeight: 500 }}>{q.author}</Typography>
      </Box>
    ))}
  </>
);
