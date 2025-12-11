import React from 'react';
import { Box, Typography } from '@mui/material';

const sections = [
  {
    quotes: [
      {
        text: '"Growing up around this area, there’s positives and negatives. Supporting this brings out the positives."',
        author: 'Zech Obiero',
      },
      {
        text: '"I’m feeling the drip, man. Puffer jackets, hats – it’s me. It resonates with the younger generation."',
        author: 'Zech Obiero',
      },
      {
        text: '"The club is a family club. From the minute I came here, I enjoyed it and never looked back."',
        author: 'Zech Obiero',
      },
    ],
  },
];

export const ProjectZeroZECHOBIIERO: React.FC = () => (
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

export default ProjectZeroZECHOBIIERO;
