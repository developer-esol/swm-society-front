import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProjectZeroIntro: React.FC = () => (
  <Box sx={{ maxWidth: 'none' }}>
    <Typography sx={{ fontSize: '1.125rem', mb: 3, lineHeight: 1.8 }}>
      SWMSOCIETY is proud to have designed and curated Project ZerO's, a transition project that aligns perfectly with our Style With Meaning philosophy—where fashion is not just about what you wear, but about the message it carries and the impact it creates.
    </Typography>
    <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
      The move from primary to secondary school is a pivotal moment in a young person's life. It's a time filled with excitement but also uncertainty—navigating new environments, making new friendships, handling academic pressure, and finding a sense of belonging. Many young people face self-doubt and anxiety during this transition, making support systems and mentorship essential.
    </Typography>
    <Typography sx={{ mb: 3, lineHeight: 1.8 }}>
      That's why we are honored to collaborate with Project Zero, A-Star Foundation, and Leyton Orient Football Club to create Project ZerO's—a capsule collection designed not only to raise awareness but also to provide real support for young students during this crucial stage of their journey.
    </Typography>
  </Box>
);
