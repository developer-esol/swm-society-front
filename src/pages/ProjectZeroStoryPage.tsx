import React from 'react';
import { Box, Container } from '@mui/material';
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
      <ProjectZeroShopButton />
      <ProjectZeroSectionTitle>OMAR BECKLES – PURPOSE & MENTORSHIP</ProjectZeroSectionTitle>
      <ProjectZeroMentorshipQuotes />
      <ProjectZeroSectionTitle>OMAR BECKLES – TRANSITION & EDUCATION</ProjectZeroSectionTitle>
      <ProjectZeroTransitionQuotes />
      <ProjectZeroShopButton />
    </Container>
  </Box>
);

export default ProjectZeroStoryPage;
