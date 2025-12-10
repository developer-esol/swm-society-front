import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../api/services';

// Validation Schema using Yup
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  // Combined error from store and local
  const loginError = error || localError;

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values: LoginFormValues) => {
      try {
        setLocalError(null);

        console.log('Starting login process for:', values.email);

        // Use auth store to login
        await login(values.email, values.password);

        console.log('Login successful, redirecting to home');

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Login failed. Please check your email and password.';
        setLocalError(errorMessage);
      }
    },
  });

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleGoogleLogin = () => {
    // Google OAuth login implementation
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Check if Client ID is configured
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      // Show helpful message for testing
      setLoginError(
        'Google OAuth not configured yet. To set up:\n' +
        '1. Visit https://console.cloud.google.com/\n' +
        '2. Create OAuth 2.0 Client ID\n' +
        '3. Add Client ID to .env.local as VITE_GOOGLE_CLIENT_ID\n' +
        '4. Add redirect URI: ' + window.location.origin + '/auth/google/callback\n\n' +
        'For now, use email/password to test login.'
      );
      return;
    }
    
    // Build Google OAuth URL
    const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
    const scope = 'openid profile email';
    const responseType = 'code';
    const accessType = 'offline';
    
    const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleOAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    googleOAuthUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    googleOAuthUrl.searchParams.append('response_type', responseType);
    googleOAuthUrl.searchParams.append('scope', scope);
    googleOAuthUrl.searchParams.append('access_type', accessType);
    
    // Generate state parameter for security (CSRF protection)
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('google_oauth_state', state);
    googleOAuthUrl.searchParams.append('state', state);
    
    // Redirect to Google login
    window.location.href = googleOAuthUrl.toString();
  };

  return (
    <Box
      sx={{
        bgcolor: colors.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        width: '100%',
        minHeight: 'auto',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: colors.text.primary,
              mb: 4,
              fontSize: { xs: '1.75rem', md: '2rem' },
            }}
          >
            Login to your account
          </Typography>

          {/* Error Message */}
          {loginError && (
            <Box
              sx={{
                bgcolor: 'rgba(220, 38, 38, 0.1)',
                border: `1px solid ${colors.button.primary}`,
                borderRadius: '8px',
                p: 2,
                mb: 3,
              }}
            >
              <Typography sx={{ color: colors.button.primary, fontSize: '0.9rem' }}>
                {loginError}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit} style={{ textAlign: 'left' }}>
            {/* Email Field */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: colors.input.bg,
                    '& fieldset': {
                      borderColor: colors.border.light,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border.default,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.button.primary,
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.text.disabled,
                    opacity: 0.7,
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: colors.input.bg,
                    '& fieldset': {
                      borderColor: colors.border.light,
                    },
                    '&:hover fieldset': {
                      borderColor: colors.border.default,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.button.primary,
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.text.disabled,
                    opacity: 0.7,
                  },
                }}
              />
            </Box>

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    sx={{
                      color: colors.text.disabled,
                      '&.Mui-checked': {
                        color: colors.button.primary,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: colors.text.primary,
                    }}
                  >
                    Remember me
                  </Typography>
                }
              />
              <Link
                onClick={handleForgotPassword}
                sx={{
                  cursor: 'pointer',
                  color: colors.button.primary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                py: 1.75,
                mb: 2,
                cursor: isLoading || !formik.isValid || !formik.dirty ? 'not-allowed' : 'pointer',
                '&:hover': {
                  bgcolor: isLoading || !formik.isValid || !formik.dirty ? colors.button.primary : colors.button.primaryHover,
                },
                '&:disabled': {
                  bgcolor: colors.button.primary,
                  color: colors.text.secondary,
                  opacity: 0.6,
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Register Link */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: colors.text.primary,
              }}
            >
              Don't have an account?{' '}
              <Link
                onClick={handleRegister}
                sx={{
                  cursor: 'pointer',
                  color: colors.button.primary,
                  textDecoration: 'none',
                  fontWeight: '600',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>

          {/* Divider */}
          <Divider
            sx={{
              my: 3,
              '&::before, &::after': {
                borderColor: colors.border.light,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '0.85rem',
                color: colors.text.disabled,
              }}
            >
              Or
            </Typography>
          </Divider>

          {/* Google Login Button - Styled like official Google Sign In */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              bgcolor: '#ffffff',
              color: '#3c4043',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              py: 1.5,
              border: `1px solid ${colors.border.light}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              '&:hover': {
                bgcolor: '#f8f9fa',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              },
              '&:active': {
                bgcolor: '#f1f3f4',
              },
            }}
          >
            {/* Google Logo */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
