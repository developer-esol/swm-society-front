import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { Upload, X, Check } from 'lucide-react';
import { colors } from '../../theme';
import { apiClient } from '../../api/apiClient';

interface ImageUploadProps {
  value: string; // Current image/video URL
  onChange: (url: string) => void; // Callback when media is uploaded
  label?: string;
  error?: boolean;
  helperText?: string;
  acceptVideo?: boolean; // Allow video uploads
  maxFileSize?: number; // Max file size in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Product Image',
  error = false,
  helperText,
  acceptVideo = false,
  maxFileSize = 5, // Default 5MB for images (ignored when acceptVideo=true)
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos
  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];
  const ALLOWED_TYPES = acceptVideo 
    ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    : ALLOWED_IMAGE_TYPES;

  const isVideoFile = (fileType: string) => ALLOWED_VIDEO_TYPES.includes(fileType);

  const isMediaUrlVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const validateFile = (file: File): string | null => {
    // Check file type first
    if (!ALLOWED_TYPES.includes(file.type)) {
      if (acceptVideo) {
        return 'Only PNG, JPG, JPEG, WebP images or MP4, WebM, MOV videos are allowed';
      }
      return 'Only PNG, JPG, JPEG, and WebP images are allowed';
    }

    // Check file size based on type
    const isVideo = isVideoFile(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxSizeMB = isVideo ? 50 : 5;

    if (file.size > maxSize) {
      return `${isVideo ? 'Video' : 'Image'} size must be less than ${maxSizeMB}MB`;
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

      // Determine endpoint based on file type
      const isVideo = isVideoFile(file.type);
      const endpoint = isVideo ? '/upload/video' : '/upload/image';

      // Upload to backend (which will upload to Cloudinary)
      // Note: Don't set Content-Type header - browser will set it with the correct boundary
      const response = await apiClient.post<{ url: string }>(endpoint, formData);

      if (response && response.url) {
        onChange(response.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to upload media';
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

  const getAcceptAttribute = () => {
    if (acceptVideo) {
      return '.png,.jpg,.jpeg,.webp,.mp4,.webm,.mov';
    }
    return '.png,.jpg,.jpeg,.webp';
  };

  const getFileTypeText = () => {
    if (acceptVideo) {
      return `Images (PNG, JPG, WebP) max 5MB or Videos (MP4, WebM, MOV) max 50MB`;
    }
    return `PNG, JPG, JPEG, or WebP • Max 5MB`;
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
          accept={getAcceptAttribute()}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Media Preview */}
        {value && (
          <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
            {isMediaUrlVideo(value) ? (
              <Box
                component="video"
                src={value}
                controls
                sx={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '4px',
                  objectFit: 'contain',
                }}
              />
            ) : (
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
            )}
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
          {uploading ? 'Uploading...' : value ? 'Change Media' : acceptVideo ? 'Select Media' : 'Select Image'}
        </Button>

        {/* File type info */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: colors.text.disabled,
            mt: 1,
          }}
        >
          {getFileTypeText()}
        </Typography>
      </Box>

      {/* Success Message */}
      {uploadSuccess && (
        <Alert
          severity="success"
          icon={<Check size={18} />}
          sx={{ mt: 2 }}
        >
          {acceptVideo ? 'Media uploaded successfully!' : 'Image uploaded successfully!'}
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
