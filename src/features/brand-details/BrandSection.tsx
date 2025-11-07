import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { CustomButton } from '../../components';

interface BrandSectionProps {
  name: string;
  description: string;
  image: string;
  shopLink: string;
  storyLink: string;
  imagePosition?: 'left' | 'right';
}

export const BrandSection: React.FC<BrandSectionProps> = ({
  name,
  description,
  image,
  shopLink,
  storyLink,
  imagePosition = 'left'
}) => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { 
              xs: 'column', 
              md: imagePosition === 'right' ? 'row-reverse' : 'row' 
            },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
          }}
        >
          {/* Image Section */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 45%' },
              width: '100%',
              height: { xs: '300px', md: '400px' },
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={image}
              alt={`${name} Collection`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
          {/* Content Section */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                color: 'black',
                letterSpacing: '0.05em',
              }}
            >
              {name}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              {description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                mt: 2,
              }}
            >
              <CustomButton
                text="Shop Now"
                onClick={() => window.location.href = shopLink}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              />
              <CustomButton
                text="Learn More"
                onClick={() => window.location.href = storyLink}
                sx={{
                  borderColor: '#9ca3af',
                  color: 'black',
                  bgcolor: '#e5e7eb',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#6b7280',
                    bgcolor: '#d1d5db',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};