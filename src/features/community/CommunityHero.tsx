import React from 'react';
import { Box, Typography, Button as MuiButton } from '@mui/material';
import { colors } from '../../theme';

interface CommunityHeroProps {
  onShareYourLook: () => void;
}

export const CommunityHero: React.FC<CommunityHeroProps> = ({ onShareYourLook }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '450px', md: '550px' },
        backgroundImage: 'url(/community.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
            letterSpacing: '0.05em',
          }}
        >
          Join Our Style Community
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 3,
            fontSize: { xs: '0.95rem', md: '1.125rem' },
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          Connect through fashion that makes a statement. Share your looks and be part of a movement that values style with meaning.
        </Typography>
        <MuiButton
          variant="contained"
          onClick={onShareYourLook}
          sx={{
            bgcolor: colors.button.primary,
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: colors.button.primaryHover,
            },
            textTransform: 'none',
          }}
        >
          Share Your Look
        </MuiButton>
      </Box>
    </Box>
  );
};
