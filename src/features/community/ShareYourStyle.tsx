import React, { useState } from 'react';
import { Container, Box, Typography, Button as MuiButton, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { communityService } from '../../api/services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';

interface ShareYourStyleProps {
  onPostSuccess?: () => void;
}

interface ShareYourStyleFormValues {
  caption: string;
  description: string;
  imageUrl: string;
}

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  caption: Yup.string()
    .required('Caption is required')
    .min(5, 'Caption must be at least 5 characters')
    .max(100, 'Caption cannot exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  imageUrl: Yup.string()
    .required('Image URL is required')
    .url('Please enter a valid URL'),
});

export const ShareYourStyle: React.FC<ShareYourStyleProps> = ({ onPostSuccess }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const formik = useFormik<ShareYourStyleFormValues>({
    initialValues: {
      caption: '',
      description: '',
      imageUrl: 'https://example.com/community-post.jpg',
    },
    validationSchema,
    onSubmit: async (values: ShareYourStyleFormValues) => {
      if (!isAuthenticated || !user?.id) {
        console.error('User must be authenticated to create posts');
        alert('Please log in to create a post');
        return;
      }

      try {
        setIsSubmitting(true);
        
        // Create the post using the real API with user-provided image URL
        const newPost = await communityService.create({
          userId: user.id,
          description: values.description || values.caption,
          imageUrl: values.imageUrl,
        });
        
        console.log('Post created successfully:', newPost);
        alert('Post created successfully!');
        
        // Reset form after successful submission
        formik.resetForm();
        setPreviewUrl(null);
        setShowPostForm(false);
        
        if (onPostSuccess) {
          onPostSuccess();
        }
      } catch (error) {
        console.error('Failed to create post:', error);
        
        // Show more detailed error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to create post: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Update preview when imageUrl changes
  React.useEffect(() => {
    if (formik.values.imageUrl) {
      setPreviewUrl(formik.values.imageUrl);
    }
  }, [formik.values.imageUrl]);

  return (
    <Box sx={{ bgcolor: colors.background.light, width: '100%', py: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          {/* Section Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: colors.text.primary,
              mb: 2,
            }}
          >
            Share Your Style
          </Typography>

          {/* Section Description */}
          <Typography
            variant="body2"
            sx={{
              color: colors.text.gray,
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Show us how you wear our SWMSOCIETY pieces. Tag @swmsociety and use #StyleWithMeaning for a chance to be featured.
          </Typography>

          {/* CTA Button - Shop the Collection */}
          {!showPostForm && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
              <MuiButton
                variant="contained"
                sx={{
                  bgcolor: colors.button.primary,
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#b91c1c',
                  },
                }}
                onClick={() => (window.location.href = '/shop')}
              >
                Shop the Collection
              </MuiButton>
            </Box>
          )}

          {/* Add Your Post Button - Hidden when form is shown */}
          {!showPostForm && (
            <MuiButton
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#1a1a1a',
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                py: 1.5,
                mb: 2,
                maxWidth: '400px',
                mx: 'auto',
                display: 'block',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
              onClick={() => setShowPostForm(true)}
            >
              Add Your Post
            </MuiButton>
          )}
        </Box>
      </Container>

      {/* Join Our Style Community Section - Only shown when Add Your Post is clicked */}
      {showPostForm && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Section Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary,
                mb: 3,
              }}
            >
              Join Our Style Community
            </Typography>

            <form onSubmit={formik.handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* Caption Field */}
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Caption"
                  name="caption"
                  placeholder="Share your thought in one line..."
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.caption && Boolean(formik.errors.caption)}
                  helperText={formik.touched.caption && formik.errors.caption}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#bdbdbd',
                      },
                    },
                  }}
                />
              </Box>

              {/* Description Field */}
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  placeholder="Tell us more about your style..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#bdbdbd',
                      },
                    },
                  }}
                />
              </Box>

              {/* Image URL Field */}
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  value={formik.values.imageUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                  helperText={formik.touched.imageUrl && formik.errors.imageUrl}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#bdbdbd',
                      },
                    },
                  }}
                />
              </Box>

              {/* Image Preview */}
              {previewUrl && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: colors.text.gray }}
                  >
                    Image Preview:
                  </Typography>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                    }}
                    onError={() => {
                      console.error('Failed to load image preview');
                      setPreviewUrl(null);
                    }}
                  />
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <MuiButton
                  variant="outlined"
                  sx={{
                    color: colors.text.primary,
                    borderColor: colors.text.primary,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: colors.button.primary,
                      bgcolor: 'transparent',
                    },
                  }}
                  onClick={() => {
                    setShowPostForm(false);
                    formik.resetForm();
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </MuiButton>
                <MuiButton
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  sx={{
                    bgcolor: colors.overlay.dark,
                    color: colors.text.secondary,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: colors.overlay.darkHover,
                    },
                    '&:disabled': {
                      bgcolor: colors.border.default,
                      color: colors.text.disabled,
                    },
                  }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </MuiButton>
              </Box>
            </form>
          </Box>
        </Container>
      )}
    </Box>
  );
};
