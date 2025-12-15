import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ProjectZeroHero } from '../features/project-zero-story/ProjectZeroHero';
import { ProjectZeroIntro } from '../features/project-zero-story/ProjectZeroIntro';
import { ProjectZeroQuote } from '../features/project-zero-story/ProjectZeroQuote';
import { ProjectZeroImages } from '../features/project-zero-story/ProjectZeroImages';
import { ProjectZeroSectionTitle } from '../features/project-zero-story/ProjectZeroSectionTitle';
import { ProjectZeroPartners } from '../features/project-zero-story/ProjectZeroPartners';
import { ProjectZeroShopButton } from '../features/project-zero-story/ProjectZeroShopButton';
import { ProjectZeroMentorshipQuotes } from '../features/project-zero-story/ProjectZeroMentorshipQuotes';
import { ProjectZeroTransitionQuotes } from '../features/project-zero-story/ProjectZeroTransitionQuotes';
import { ProjectZeroPurposeSection } from '../features/project-zero-story/ProjectZeroPurposeSection';
import { ProjectZeroPlayerQuotes } from '../features/project-zero-story/ProjectZeroPlayerQuotes';
import ProjectZeroStyle from '../features/project-zero-story/ProjectZeroStyle';
import ProjectZeroZECHOBIIERO from '../features/project-zero-story/ProjectZeroZECHOBIIERO';
import ProjectZeroFanCulture from '../features/project-zero-story/ProjectZeroFanCulture';

export const ProjectZeroStoryPage: React.FC = () => (
  <Box sx={{ bgcolor: 'white', width: '100%' }}>
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 12 } }}>
      <ProjectZeroHero />
      <ProjectZeroIntro />
      <ProjectZeroQuote
        quote="Bringing the community together for positive early intervention is key. This project uses creativity and insight to support young people at a crucial stage in their journey."
        author="— Kenneth Bonsu, Co-Founder of A-Star Foundation"
      />
      <ProjectZeroImages />
      <ProjectZeroSectionTitle>A COLLECTION INSPIRED BY THE LEYTON ORIENT FAITHFUL</ProjectZeroSectionTitle>
      <Box sx={{ fontSize: '1.125rem', mb: 3, lineHeight: 1.8 }}>
        <Typography sx={{fontSize: '1.125rem', mb: 3, lineHeight: 1.8 }}>
          Understanding the deep connection between the club and its supporters, we kept the Leyton
          Orient faithful in mind when designing this collection. The colourways are inspired by the club’s
          iconic kit, paying homage to the heritage and pride that come with representing The O’s—a
          nickname that also perfectly ties into the theme of Project ZerO’s, symbolizing a fresh start and
          new beginnings.
        </Typography>
        <Typography sx={{ mb: 3, lineHeight: 1.8}}>
          We are immensely proud that this project was made possible by the dedication of Leyton
          Orient’s first-team players—Omar Beckles, Zech Obiero, Sean Clare, and Sonny Perkins—who
          went to great lengths to ensure it became a reality. Led by club captain Omar Beckles, their
          commitment to this cause reflects the values of leadership, mentorship, and giving back to the
          community.
        </Typography>
      </Box>
      <ProjectZeroQuote
        quote="As someone who grew up in this community, now representing the club and as a parent, I know how essential this is. I'm honored and love what SwMSociety has created and executed."
        author="— Omar Beckles, Leyton Orient Captain"
      />
      <ProjectZeroSectionTitle>OUR PARTNERS</ProjectZeroSectionTitle>
      <ProjectZeroPartners />
      <ProjectZeroQuote
        quote="Supporting young people at this stage of their lives is essential. Project ZerO's gives them the tools, confidence, and community support they need to navigate the transition successfully."
        author="— Steve Barnabis, Founder of Project Zero"
      />
      <ProjectZeroSectionTitle>STYLE WITH MEANING: A COLLECTION WITH PURPOSE</ProjectZeroSectionTitle>
      <ProjectZeroPurposeSection />
      <ProjectZeroSectionTitle>OMAR BECKLES – PURPOSE & MENTORSHIP</ProjectZeroSectionTitle>
      <ProjectZeroMentorshipQuotes />
      <ProjectZeroSectionTitle>OMAR BECKLES – TRANSITION & EDUCATION</ProjectZeroSectionTitle>
      <ProjectZeroTransitionQuotes />
      <ProjectZeroSectionTitle>OMAR BECKLES – PERSONAL STORY & ADVICE</ProjectZeroSectionTitle>
      <ProjectZeroPlayerQuotes />
      <ProjectZeroSectionTitle>SEAN CLARE – STYLE & COMMUNITY</ProjectZeroSectionTitle>
      <ProjectZeroStyle />
      <ProjectZeroSectionTitle>ZECH OBIIERO – STYLE & COMMUNITY SPIRIT</ProjectZeroSectionTitle>
      <ProjectZeroZECHOBIIERO />
      <ProjectZeroSectionTitle>SEAN & ZECH – FAN CULTURE (OFF CAMERA)</ProjectZeroSectionTitle>
      <ProjectZeroFanCulture />
      <ProjectZeroShopButton />
    </Container>
  </Box>
);

export default ProjectZeroStoryPage;
