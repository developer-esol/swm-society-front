import { Box, Paper, Typography, Button, Rating } from '@mui/material'
import { Eye as ViewIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { Review } from '../../../types/review'

interface ReviewsCardProps {
  review: Review
  onView?: (review: Review) => void
  onDelete?: (id: string) => void
}

const ReviewsCard = ({ review, onView, onDelete }: ReviewsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 1.5 },
        mb: 1.5,
        bgcolor: colors.background.default,
        border: `1px solid ${colors.border.default}`,
        borderRadius: 1,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: { xs: 1, sm: 2 },
        minHeight: 'auto',
      }}
    >
      {/* Left Section: Content */}
      <Box sx={{ flex: 1 }}>
        {/* Reviewer Name */}
        <Typography
          sx={{
            fontWeight: 600,
            color: colors.text.primary,
            fontSize: '0.9rem',
            mb: 0.5,
          }}
        >
          {review.userName}
        </Typography>

        {/* Star Rating */}
        <Box sx={{ mb: 0.5 }}>
          <Rating value={review.rating} readOnly size="small" sx={{ color: '#FFC107' }} />
        </Box>

        {/* Review Comment */}
        <Typography
          sx={{
            color: colors.text.primary,
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}
        >
          {review.comment}
        </Typography>
      </Box>

      {/* Right Section: ID, Date, and Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          alignItems: { xs: 'center', sm: 'flex-end' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          gap: { xs: 1, sm: 1 },
          minWidth: { xs: '100%', sm: 'fit-content' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {/* User ID and Date */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 0.2 } }}>
          <Typography
            sx={{
              color: colors.text.disabled,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontWeight: 500,
            }}
          >
            User ID: {review.userId}
          </Typography>
          <Typography
            sx={{
              color: colors.text.disabled,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          >
            {formatDate(review.createdAt)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={() => onView?.(review)}
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
              color: colors.text.primary,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: colors.background.lighter,
              },
            }}
          >
            <ViewIcon size={18} />
          </Button>
          <Button
            onClick={() => onDelete?.(review.id)}
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
            <DeleteIcon size={18} />
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ReviewsCard
