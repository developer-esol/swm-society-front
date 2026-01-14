import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { Upload, X, Check } from 'lucide-react';
import { colors } from '../../theme';
import { apiClient } from '../../api/apiClient';

interface ImageUploadProps {
  value: string; // Current image URL
  onChange: (url: string) => void; // Callback when image is uploaded
  label?: string;
  error?: boolean;
  helperText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Product Image',
  error = false,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PNG, JPG, JPEG, and WebP images are allowed';
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploadError(null);
    setUploadSuccess(false);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend (which will upload to Cloudinary)
      // Note: Don't set Content-Type header - browser will set it with the correct boundary
      const response = await apiClient.post<{ url: string }>('/upload/image', formData);

      if (response && response.url) {
        onChange(response.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to upload image';
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploadSuccess(false);
    setUploadError(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: error ? colors.status.error : colors.text.primary,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          border: `2px dashed ${error ? colors.status.error : colors.border.default}`,
          borderRadius: '8px',
          p: 3,
          textAlign: 'center',
          bgcolor: colors.background.light,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: error ? colors.status.error : colors.text.disabled,
            bgcolor: colors.background.lighter,
          },
        }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Image Preview */}
        {value && (
          <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src={value}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '4px',
                objectFit: 'contain',
              }}
            />
            <Button
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: '32px',
                width: '32px',
                height: '32px',
                p: 0,
                bgcolor: colors.danger.primary,
                color: colors.text.secondary,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
              }}
            >
              <X size={16} />
            </Button>
          </Box>
        )}

        {/* Upload Button */}
        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={16} /> : <Upload size={16} />}
          sx={{
            bgcolor: colors.text.primary,
            color: colors.text.secondary,
            textTransform: 'none',
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: colors.overlay.darkHoverLight,
            },
            '&:disabled': {
              bgcolor: colors.button.primaryDisabled,
              color: colors.text.secondary,
            },
          }}
        >
          {uploading ? 'Uploading...' : value ? 'Change Image' : 'Select Image'}
        </Button>

        {/* File type info */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.text.disabled,
            mt: 1,
          }}
        >
          PNG, JPG, JPEG, or WebP • Max 5MB
        </Typography>
      </Box>

      {/* Success Message */}
      {uploadSuccess && (
        <Alert
          severity="success"
          icon={<Check size={18} />}
          sx={{ mt: 2 }}
        >
          Image uploaded successfully!
        </Alert>
      )}

      {/* Upload Error */}
      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}

      {/* Validation Error */}
      {error && helperText && (
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.status.error,
            mt: 0.5,
            ml: 1.75,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
