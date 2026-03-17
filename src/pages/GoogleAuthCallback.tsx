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
        // Check for token in query params (backend should send: ?token=xxx)
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');
        
        // Also check URL hash for token (in case backend uses #token=xxx)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const hashToken = hashParams.get('token');
        
        const authToken = token || hashToken;
        
        // Check for error in params
        const errorParam = searchParams.get('error');
        
        if (errorParam) {
          setError(`Google authentication failed: ${errorParam}`);
          setIsProcessing(false);
          return;
        }

        if (authToken) {
          // Store tokens from backend redirect
          localStorage.setItem('authToken', authToken);
          
          if (email) localStorage.setItem('userEmail', email);
          if (name) localStorage.setItem('userName', name);
          if (userId) localStorage.setItem('userId', userId);
          // Normalize role: if backend sends role name (e.g. "USER"), map to role ID to match regular login
          if (role) {
            const roleNormalized = role.toLowerCase() === 'user' ? '1'
              : role.toLowerCase() === 'moderator' ? '2'
              : role.toLowerCase() === 'admin' ? '3'
              : role;
            localStorage.setItem('userRole', roleNormalized);
          }
          
          console.log('[GoogleAuth] Successfully authenticated with token');
          
          // Clear OAuth state
          localStorage.removeItem('google_oauth_state');
          
          // Redirect to home
          setTimeout(() => {
            navigate('/');
          }, 500);
          return;
        }

        // Fallback: Check for authorization code (old flow)
        const authCode = searchParams.get('code');
        const state = searchParams.get('state');

        if (authCode) {
          // Verify state parameter (CSRF protection)
          const savedState = localStorage.getItem('google_oauth_state');
          if (state && state !== savedState) {
            setError('Invalid state parameter - possible CSRF attack');
            setIsProcessing(false);
            return;
          }

          // If we have a code but no token, backend didn't complete OAuth flow
          setError('Backend OAuth configuration incomplete. Backend received code but did not generate token.');
          setIsProcessing(false);
          return;
        }

        // No token or code found
        setError('No authorization data received. Please try again.');
        setIsProcessing(false);
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
