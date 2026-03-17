import React from 'react';
import { Box, Container, Typography, Link, IconButton, Button } from '@mui/material';
import { Instagram, ChatBubbleOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../theme';


export const Footer: React.FC = () => {
  const openHubSpotChat = () => {
    // Check if HubSpot Conversations API is loaded
    if (typeof window.HubSpotConversations !== 'undefined' && window.HubSpotConversations?.widget) {
      try {
        window.HubSpotConversations.widget.open();
        console.log('[Footer] HubSpot chat opened successfully');
        return;
      } catch (error) {
        console.error('[Footer] Error opening HubSpot chat:', error);
        alert('Unable to open chat. Please email us at support@swmsociety.com');
        return;
      }
    }

    // HubSpot not loaded - show helpful message
    console.warn('[Footer] HubSpot chat widget is not available. Make sure a chatflow is published in HubSpot.');
    alert('Live chat is currently unavailable.\n\nTo enable it:\n1. Go to HubSpot → Conversations → Chatflows\n2. Create/publish a chatflow\n3. Set it to appear on all pages\n\nOr email us at: support@swmsociety.com');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.text.primary,
        color: colors.text.secondary,
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
              md: 'repeat(5, 1fr)',
            },
            gap: 4,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}>
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
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1' } }}>
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
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1' } }}>
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

          {/* Customer Support Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: '1.125rem',
              }}
            >
              Customer Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.400',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                Need help? Our support team is here to assist you.
              </Typography>
              <Button
                onClick={openHubSpotChat}
                startIcon={<ChatBubbleOutline />}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid',
                  borderColor: 'grey.700',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'white',
                  },
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1,
                }}
              >
                Chat with us
              </Button>
            </Box>
          </Box>

          {/* Stay Connected Section */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}>
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://instagram.com/swmsociety_"
                target="_blank"
                rel="noopener noreferrer"
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
                href="https://www.tiktok.com/@swmsociety_"
                target="_blank"
                rel="noopener noreferrer"
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </IconButton>
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