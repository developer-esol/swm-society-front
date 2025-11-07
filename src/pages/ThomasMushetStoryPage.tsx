import React from 'react';
import { Box, Container } from '@mui/material';
import { ThomasMushetHero } from '../features/thomas-mushet-story/ThomasMushetHero';
import { ThomasMushetIntro } from '../features/thomas-mushet-story/ThomasMushetIntro';
import { ThomasMushetImage } from '../features/thomas-mushet-story/ThomasMushetImage';
import { ThomasMushetSectionTitle } from '../features/thomas-mushet-story/ThomasMushetSectionTitle';
import { ThomasMushetQuote } from '../features/thomas-mushet-story/ThomasMushetQuote';
import { ThomasMushetQualitySection } from '../features/thomas-mushet-story/ThomasMushetQualitySection';
import { ThomasMushetShopButton } from '../features/thomas-mushet-story/ThomasMushetShopButton';

export const ThomasMushetStoryPage: React.FC = () => (
  <Box sx={{ bgcolor: 'white', width: '100%' }}>
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 12 } }}>
      <ThomasMushetHero />
      <Box sx={{ maxWidth: 'none' }}>
        <ThomasMushetIntro />
        <ThomasMushetImage />
        <ThomasMushetSectionTitle>THE INSPIRATION</ThomasMushetSectionTitle>
        <ThomasMushetIntro />
        <ThomasMushetQuote />
        <ThomasMushetSectionTitle>QUALITY AND CRAFTSMANSHIP</ThomasMushetSectionTitle>
        <ThomasMushetQualitySection />
        <ThomasMushetShopButton />
      </Box>
    </Container>
  </Box>
);

export default ThomasMushetStoryPage;
