import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { CustomButton } from '../../components';

interface BrandSlide {
  id: number;
  name: string;
  image: string;
  shopLink: string;
  storyLink: string;
}

export const Carousel: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: BrandSlide[] = [
    {
      id: 1,
      name: "Project ZerO's",
      image: '/thumbnail.jpg',
      shopLink: "/shop?collection=Project%20ZerO's",
      storyLink:'/project-zero-story',
    },
    {
      id: 2,
      name: 'Thomas Mushet',
      image: '/B2.webp',
      shopLink: '/shop?collection=Thomas%20Mushet',
      storyLink: '/thomas-mushet-story',
    },
    {
      id: 3,
      name: 'Hear My Voice',
      image: '/b3.jpg',
      shopLink: '/shop?collection=Hear%20My%20Voice',
      storyLink: '/hear-my-voice-story',
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <Box
      sx={{
  position: 'relative',
  height: '80vh',
  width: '100%',
  bgcolor: 'black',
  overflow: 'hidden',
      }}
    >
      {/* Slides */}
      <Box sx={{ height: '100%', position: 'relative', width: '100%' }}>
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transition: 'opacity 1s',
              opacity: index === activeSlide ? 1 : 0,
              pointerEvents: index === activeSlide ? 'auto' : 'none',
            }}
          >
            {/* Background Image */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <Box
                component="img"
                src={slide.image}
                alt={slide.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </Box>

            {/* Overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: index === 1 
                  ? 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                px: { xs: 3, md: 8 },
                py: { xs: 4, md: 8 },
              }}
            >
              <Box 
                sx={{ 
                  maxWidth: '600px',
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.25rem', md: '3.75rem' },
                    fontWeight: 'bold',
                    mb: 4,
                    color: 'white',
                  }}
                >
                  {slide.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <CustomButton
                    text="Shop Now"
                    onClick={() => window.location.href = slide.shopLink}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.125rem',
                    }}
                  />
                  <CustomButton
                    text="Learn More"
                    onClick={() => window.location.href = slide.storyLink}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      bgcolor: 'transparent',
                      border: '1px solid white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.125rem',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          p: 1,
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <ChevronLeft sx={{ fontSize: '2rem' }} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          p: 1,
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <ChevronRight sx={{ fontSize: '2rem' }} />
      </IconButton>

      {/* Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            component="button"
            onClick={() => setActiveSlide(index)}
            sx={{
              height: 8,
              borderRadius: 9999,
              transition: 'all 0.3s',
              width: index === activeSlide ? 32 : 8,
              bgcolor: index === activeSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: index === activeSlide ? 'white' : 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};