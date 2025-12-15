import React, { useState } from 'react';
import { useEffect } from 'react';
import { userService } from '../api/services/admin/userService';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { colors } from '../theme';
import type { Review } from '../types/review';

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onDelete?: (reviewId: string) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  onDelete,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const isOwnReview = currentUserId === review.userId;

  useEffect(() => {
    let mounted = true;
    const loadName = async () => {
      try {
        const u = await userService.getById(review.userId);
        if (mounted) setUserName(u?.name || null);
      } catch (e) {
        // ignore
      }
    };
    void loadName();
    return () => { mounted = false };
  }, [review.userId]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(review.id);
      setOpenDeleteDialog(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete review'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isDeleting) {
      setOpenDeleteDialog(false);
      setError(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Card
        sx={{
          mb: 1.5,
          border: `1px solid ${colors.border.light}`,
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          {/* Header: User Info and Date */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {userName ? userName : `User: ${review.userId}`}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.disabled, fontSize: '0.75rem' }}>
              {formatDate(review.createdAt)}
            </Typography>
          </Box>

          {/* Rating */}
          <Box sx={{ mb: 0.8 }}>
            <Rating value={review.rating} readOnly size="small" />
          </Box>

          {/* Title */}
          {/* Title removed from review model; show comment only */}

          {/* Comment */}
          <Typography variant="body2" sx={{ color: colors.text.lightGray, mb: 1.5, fontSize: '0.85rem', lineHeight: 1.4 }}>
            {review.comment}
          </Typography>

          {/* Delete Button - Only for own reviews */}
          {isOwnReview && onDelete && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                onClick={handleDeleteClick}
                sx={{
                  minWidth: '40px',
                  width: '40px',
                  height: '40px',
                  p: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: '6px',
                  color: '#dc2626',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: '#fee2e2',
                  },
                }}
              >
                <Trash2 size={18} />
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? <CircularProgress size={20} /> : <Trash2 size={16} />
            }
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewCard;
