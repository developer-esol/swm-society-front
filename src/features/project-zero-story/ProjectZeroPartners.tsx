import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProjectZeroPartners: React.FC = () => (
  <Box component="ul" sx={{ pl: 3, mb: 3 }}>
    <Typography component="li" sx={{ mb: 1, lineHeight: 1.8 }}>
      <Box component="span" sx={{ fontWeight: 500 }}>Project Zero</Box> – Committed to community safety and youth development, Project Zero provides mentorship, safe spaces, and opportunities that empower young people to make positive life choices.
    </Typography>
    <Typography component="li" sx={{ mb: 1, lineHeight: 1.8 }}>
      <Box component="span" sx={{ fontWeight: 500 }}>A-Star Foundation</Box> – Focused on youth empowerment, A-Star delivers mentorship, leadership training, and personal development programs to inspire confidence and success in young people.
    </Typography>
    <Typography component="li" sx={{ mb: 1, lineHeight: 1.8 }}>
      <Box component="span" sx={{ fontWeight: 500 }}>Leyton Orient Football Club</Box> – As London's second oldest professional football club, Leyton Orient has a rich history and a deep-rooted connection to its community, making them the perfect partners for this initiative.
    </Typography>
  </Box>
);
