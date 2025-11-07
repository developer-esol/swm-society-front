import React, { useState } from 'react';
import { Box, Container, Typography, Link, TextField, IconButton } from '@mui/material';
import { Instagram, Twitter, Facebook } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { CustomButton } from './CustomButton';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        py: { xs: 6, md: 8 },
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(12, 1fr)',
            },
            gap: 4,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3' } }}>
            <Box sx={{ mb: 2 }}>
              <Box
                component="img"
                src="/image.png"
                alt="SWMSOCIETY"
                sx={{ height: 40, mb: 2 }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.400',
                  lineHeight: 1.6,
                  fontSize: '0.875rem',
                }}
              >
                Style With Meaning - where fashion is not just about what you wear, but about the message it carries and the impact it creates.
              </Typography>
            </Box>
          </Box>

          {/* Shop Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 2' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: '1.125rem',
              }}
            >
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/shop"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                All Products
              </Link>
              <Link
                component={RouterLink}
                to="/shop?collection=Project%20ZerO's"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Project ZerO's
              </Link>
              <Link
                component={RouterLink}
                to="/shop?collection=Thomas%20Mushet"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Thomas Mushet
              </Link>
              <Link
                component={RouterLink}
                to="/shop?collection=Hear%20My%20Voice"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Hear My Voice
              </Link>
            </Box>
          </Box>

          {/* Information Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 3' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: '1.125rem',
              }}
            >
              Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/about"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Contact
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Privacy Policy
              </Link>
            </Box>
          </Box>

          {/* Stay Connected Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: '1.125rem',
              }}
            >
              Stay Connected
            </Typography>
            
            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                sx={{
                  color: 'white',
                  border: '1px solid',
                  borderColor: 'grey.700',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                sx={{
                  color: 'white',
                  border: '1px solid',
                  borderColor: 'grey.700',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                sx={{
                  color: 'white',
                  border: '1px solid',
                  borderColor: 'grey.700',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Facebook />
              </IconButton>
            </Box>

            {/* Newsletter Subscription */}
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                fontSize: '0.875rem',
              }}
            >
              Subscribe to our newsletter
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'grey.700',
                    },
                    '&:hover fieldset': {
                      borderColor: 'grey.500',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'grey.500',
                      opacity: 1,
                    },
                  },
                }}
              />
              <CustomButton
                text="Subscribe"
                onClick={handleSubscribe}
              />
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'grey.800',
            mt: 6,
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'grey.500',
              fontSize: '0.875rem',
            }}
          >
            © 2025 SWMSOCIETY. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};