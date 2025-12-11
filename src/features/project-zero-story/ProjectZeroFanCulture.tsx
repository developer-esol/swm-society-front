import React from 'react';
import { Box, Typography } from '@mui/material';

const sections = [
  {
    quotes: [
      {
        text: '"If you get us wearing those jackets, the fans are going to have it!"',
        author: 'Sean Clare',
      },
      {
        text: '"Even if it’s just for one game – an FA Cup or Papa John’s game – it would go off."',
        author: 'Zech Obiero',
      },
      {
        text: '"I don’t even like red, but it looks good. A blackout version though – 100%!"',
        author: 'Sean Clare',
      },
    ],
  },
];

export const ProjectZeroFanCulture: React.FC = () => (
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

export default ProjectZeroFanCulture;
