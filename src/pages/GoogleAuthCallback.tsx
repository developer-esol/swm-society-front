import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { colors } from '../theme';

/**
 * Google OAuth Callback Page
 * This page handles the redirect from Google after user authentication
 * The authorization code is exchanged for tokens on the backend
 */
const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

      useEffect(() => {
    const processGoogleAuth = async () => {
      try {
        // Get the authorization code from URL
        const authCode = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        // Check for errors
        if (errorParam) {
          // If error is invalid_client or access_denied, provide helpful message
          if (errorParam === 'invalid_client' || errorParam === 'access_denied') {
            setError(
              'Google OAuth not configured yet. Using mock authentication instead. ' +
              'To enable real Google OAuth: 1) Get Client ID from Google Cloud Console, ' +
              '2) Add it to .env.local, 3) Add redirect URI to Google Console, ' +
              '4) Implement backend endpoint'
            );
            // Still allow mock login
            setTimeout(() => {
              const mockToken = 'mock-google-jwt-' + Date.now();
              localStorage.setItem('authToken', mockToken);
              localStorage.setItem('userEmail', 'user@gmail.com');
              localStorage.setItem('userName', 'Google User');
              localStorage.removeItem('google_oauth_state');
              navigate('/');
            }, 2000);
          } else {
            setError(`Google authentication failed: ${errorParam}`);
          }
          return;
        }

        if (!authCode) {
          setError('No authorization code received from Google');
          setIsProcessing(false);
          return;
        }

        // Verify state parameter (CSRF protection)
        const savedState = localStorage.getItem('google_oauth_state');
        if (state !== savedState) {
          setError('Invalid state parameter - possible CSRF attack');
          setIsProcessing(false);
          return;
        }

        // TODO: Send authorization code to your backend
        // Backend should exchange the code for tokens
        // Example endpoint: POST /api/auth/google/callback
        // The backend will:
        // 1. Exchange auth code for access token
        // 2. Get user info from Google
        // 3. Create/update user in database
        // 4. Return JWT token and user info

        // For now, use mock authentication
        console.log('Google Auth Code:', authCode);

        // Mock successful authentication
        // Replace this with actual backend call
        const mockResponse = {
          token: 'mock-google-jwt-' + Date.now(),
          user: {
            id: 'google-' + Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: '',
          },
        };

        // Store auth token
        localStorage.setItem('authToken', mockResponse.token);
        localStorage.setItem('userEmail', mockResponse.user.email);
        localStorage.setItem('userName', mockResponse.user.name);

        // Clear the state
        localStorage.removeItem('google_oauth_state');

        // Redirect to home page
        navigate('/');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        setIsProcessing(false);
      }
    };

    processGoogleAuth();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography sx={{ color: colors.text.primary, fontSize: '1.1rem' }}>
            Signing you in with Google...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <Typography sx={{ color: colors.button.primary, fontSize: '1.2rem', fontWeight: 'bold' }}>
            Authentication Error
          </Typography>
          <Typography sx={{ color: colors.text.primary, textAlign: 'center' }}>
            {error}
          </Typography>
          <Typography
            onClick={() => navigate('/login')}
            sx={{
              color: colors.button.primary,
              cursor: 'pointer',
              textDecoration: 'underline',
              mt: 2,
            }}
          >
            Return to Login
          </Typography>
        </Box>
      </Container>
    );
  }

  return null;
};

export default GoogleAuthCallback;
