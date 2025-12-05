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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';
import { authService } from '../api/services';

// Validation Schema using Yup
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      passwordRegex,
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (@$!%*?&)'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the Terms and Conditions')
    .required('You must agree to the Terms and Conditions'),
});

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values: RegisterFormValues) => {
      try {
        setIsLoading(true);
        setRegisterError(null);

        // Call auth service to register
        const response = await authService.register({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });

        // Store token and user data
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.fullName);

        // Redirect to login page
        navigate('/login');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Registration failed. Please try again.';
        setRegisterError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoogleSignUp = () => {
    // Google OAuth signup implementation
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Check if Client ID is configured
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      // Show helpful message for testing
      setRegisterError(
        'Google OAuth not configured yet. To set up:\n' +
        '1. Visit https://console.cloud.google.com/\n' +
        '2. Create OAuth 2.0 Client ID\n' +
        '3. Add Client ID to .env.local as VITE_GOOGLE_CLIENT_ID\n' +
        '4. Add redirect URI: ' + window.location.origin + '/auth/google/callback\n\n' +
        'For now, use email/password to create an account.'
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
    
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('google_oauth_state', state);
    googleOAuthUrl.searchParams.append('state', state);
    
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
            Create an account
          </Typography>

          {/* Error Message */}
          {registerError && (
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
                {registerError}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit} style={{ textAlign: 'left' }}>
            {/* Full Name Field */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
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
            <Box sx={{ mb: 3 }}>
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

            {/* Confirm Password Field */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

            {/* Terms and Conditions Checkbox */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{
                      color: colors.border.default,
                      '&.Mui-checked': {
                        color: colors.button.primary,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: colors.text.primary }}>
                    I agree to the{' '}
                    <Link
                      href="#"
                      sx={{
                        color: colors.button.primary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="#"
                      sx={{
                        color: colors.button.primary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
              <Typography sx={{ color: colors.button.primary, fontSize: '0.75rem', mb: 2 }}>
                {formik.errors.agreeToTerms}
              </Typography>
            )}

            {/* Create Account Button */}
            <Button
              fullWidth
              type="submit"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                py: 1.5,
                fontWeight: '600',
                fontSize: '1rem',
                textTransform: 'none',
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.border.light }} />
            <Typography sx={{ fontSize: '0.85rem', color: colors.text.disabled }}>Or</Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: colors.border.light }} />
          </Box>

          {/* Google Sign Up Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleSignUp}
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
              mb: 3,
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
            Sign up with Google
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography sx={{ fontSize: '0.9rem', color: colors.text.primary }}>
              Already have an account?{' '}
              <Link
                onClick={handleLogin}
                sx={{
                  color: colors.button.primary,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
