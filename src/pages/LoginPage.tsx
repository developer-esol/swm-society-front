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
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values: LoginFormValues) => {
      try {
        setIsLoading(true);
        setLoginError(null);

        console.log('Login attempt:', {
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful login
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userEmail', values.email);

        // Redirect to home
        navigate('/');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed. Please try again.';
        setLoginError(errorMessage);
      } finally {
        setIsLoading(false);
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
    console.log('Google login clicked');
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
                bgcolor: colors.error.lighter,
                border: `1px solid ${colors.error.main}`,
                borderRadius: '8px',
                p: 2,
                mb: 3,
              }}
            >
              <Typography sx={{ color: colors.error.main, fontSize: '0.9rem' }}>
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
              disabled={isLoading}
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                py: 1.75,
                mb: 2,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
                '&:disabled': {
                  bgcolor: colors.button.primaryDisabled,
                  color: colors.text.disabled,
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

          {/* Google Login Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              bgcolor: colors.background.lighter,
              color: colors.text.primary,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              py: 1.5,
              border: `1px solid ${colors.border.light}`,
              '&:hover': {
                bgcolor: colors.background.light,
                border: `1px solid ${colors.border.default}`,
              },
            }}
            startIcon={
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
            }
          >
            Continue with Google
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
