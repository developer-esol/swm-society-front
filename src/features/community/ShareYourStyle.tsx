import React, { useState } from 'react';
import { Container, Box, Typography, Button as MuiButton, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { colors } from '../../theme';

interface ShareYourStyleProps {
  onPostSuccess?: () => void;
}

interface ShareYourStyleFormValues {
  caption: string;
  description: string;
  image: string;
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
  image: Yup.string().required('Image is required'),
});

export const ShareYourStyle: React.FC<ShareYourStyleProps> = ({ onPostSuccess }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formik = useFormik<ShareYourStyleFormValues>({
    initialValues: {
      caption: '',
      description: '',
      image: '',
    },
    validationSchema,
    onSubmit: async (values: ShareYourStyleFormValues) => {
      try {
        // Here you would typically call the service to create a post
        // For now, we're just validating the form
        console.log('Form submitted:', values);
        // Reset form after successful submission
        formik.resetForm();
        setPreviewUrl(null);
        setShowPostForm(false);
        if (onPostSuccess) {
          onPostSuccess();
        }
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('image', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      formik.setFieldValue('image', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

              {/* Upload Image Section */}
              <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: '8px',
                  py: 4,
                  px: 2,
                  mb: 4,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'border-color 0.3s ease',
                  '&:hover': {
                    borderColor: colors.button.primary,
                  },
                  bgcolor: previewUrl ? 'transparent' : 'white',
                }}
              >
                {previewUrl ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                      }}
                    />
                    <MuiButton
                      variant="text"
                      onClick={() => {
                        setPreviewUrl(null);
                        formik.setFieldValue('image', '');
                      }}
                      sx={{ color: colors.button.primary }}
                    >
                      Change Image
                    </MuiButton>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}
                    >
                      🖼️
                    </Box>
                    <Typography
                      sx={{
                        color: 'grey.600',
                        fontSize: '0.9rem',
                        mb: 1,
                      }}
                    >
                      Drag and drop your image or click to upload
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                      <MuiButton
                        variant="text"
                        component="span"
                        sx={{ color: colors.button.primary }}
                      >
                        Choose Image
                      </MuiButton>
                    </label>
                  </Box>
                )}
                {formik.touched.image && formik.errors.image && (
                  <Typography sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                    {formik.errors.image}
                  </Typography>
                )}
              </Box>

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
                  }}
                >
                  Publish Post
                </MuiButton>
              </Box>
            </form>
          </Box>
        </Container>
      )}
    </Box>
  );
};
