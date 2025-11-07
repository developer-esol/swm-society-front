import React from 'react';
import { Box, Container } from '@mui/material';
import { HearMyVoiceHero } from '../features/hear-my-voice-story/HearMyVoiceHero';
import { HearMyVoiceIntro } from '../features/hear-my-voice-story/HearMyVoiceIntro';
import { HearMyVoiceImage } from '../features/hear-my-voice-story/HearMyVoiceImage';
import { HearMyVoiceSectionTitle } from '../features/hear-my-voice-story/HearMyVoiceSectionTitle';
import { HearMyVoiceQuote } from '../features/hear-my-voice-story/HearMyVoiceQuote';
import { HearMyVoiceMessageSection } from '../features/hear-my-voice-story/HearMyVoiceMessageSection';
import { HearMyVoiceDesignSection } from '../features/hear-my-voice-story/HearMyVoiceDesignSection';
import { HearMyVoiceShopButton } from '../features/hear-my-voice-story/HearMyVoiceShopButton';

export const HereMyVoiceStoryPage: React.FC = () => (
  <Box sx={{ bgcolor: 'white', width: '100%' }}>
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 12 } }}>
      <HearMyVoiceHero />
      <Box sx={{ maxWidth: 'none' }}>
        <HearMyVoiceIntro />
        <HearMyVoiceImage />
        <HearMyVoiceSectionTitle>THE MESSAGE</HearMyVoiceSectionTitle>
        <HearMyVoiceMessageSection />
        <HearMyVoiceQuote />
        <HearMyVoiceSectionTitle>DESIGN AND INNOVATION</HearMyVoiceSectionTitle>
        <HearMyVoiceDesignSection />
        <HearMyVoiceShopButton />
      </Box>
    </Container>
  </Box>
);

export default HereMyVoiceStoryPage;
