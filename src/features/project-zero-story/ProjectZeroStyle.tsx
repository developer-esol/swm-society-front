import React from 'react';
import { Box, Typography } from '@mui/material';

const sections = [
  {
    quotes: [
      {
        text: '"You’ve got the rain jacket, bomber jacket, tees… I liked the colour. It’s different."',
        author: 'Sean Clare',
      },
      {
        text: '"You’ve got the logo in big. People are going to ask about it. It’s a conversation starter."',
        author: 'Sean Clare',
      },
      {
        text: '"It’s important to give back to the communities that made us and shaped us."',
        author: 'Sean Clare',
      },
      {
        text: '"We have a platform to bring awareness to these initiatives. We should help where we can."',
        author: 'Sean Clare',
      },
    ],
  },
];

export const ProjectZeroStyle: React.FC = () => (
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

export default ProjectZeroStyle;
