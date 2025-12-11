import React from 'react';
import { Box, Typography } from '@mui/material';

const sections = [
  {
    quotes: [
      {
        text: '"Trevor Bailey, a PE teacher, was like a father figure to me. He made me feel at home and like I belong."',
        author: 'Omar Beckles',
      },
      {
        text: '"You’re not alone. Others feel the same way. Be the helper, and you’ll find help too."',
        author: 'Omar Beckles',
      },
    ],
  },
];

export const ProjectZeroPlayerQuotes: React.FC = () => (
  <>
    {sections.map((section, sidx) => (
      <Box key={sidx} sx={{ mt: 3, mb: 2 }}>
        {/* <Typography sx={{ fontWeight: 700, mb: 1 }}>{section.title}</Typography> */}
        {section.quotes.map((q, qidx) => (
          <Box key={qidx} sx={{ bgcolor: '#f3f4f6', p: 3, my: 1 }}>
            <Typography sx={{ fontStyle: 'italic', mb: 1 }}>{q.text}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{q.author}</Typography>
          </Box>
        ))}
      </Box>
    ))}
  </>
);

export default ProjectZeroPlayerQuotes;
