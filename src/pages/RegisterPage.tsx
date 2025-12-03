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

// Validation Schema using Yup
const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
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

        console.log('Registration attempt:', {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          agreeToTerms: values.agreeToTerms,
        });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful registration
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userEmail', values.email);
        localStorage.setItem('userName', values.fullName);

        // Redirect to home
        navigate('/');
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
                bgcolor: colors.error.lighter,
                border: `1px solid ${colors.error.main}`,
                borderRadius: '8px',
                p: 2,
                mb: 3,
              }}
            >
              <Typography sx={{ color: colors.error.main, fontSize: '0.9rem' }}>
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
              <Typography sx={{ color: colors.error.main, fontSize: '0.75rem', mb: 2 }}>
                {formik.errors.agreeToTerms}
              </Typography>
            )}

            {/* Create Account Button */}
            <Button
              fullWidth
              type="submit"
              disabled={isLoading}
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                py: 1.5,
                fontWeight: '600',
                fontSize: '1rem',
                textTransform: 'none',
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

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
