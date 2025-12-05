import { Box, Paper, Typography, IconButton, Tooltip, Rating } from '@mui/material'
import { Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material'
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
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.4 } }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => onView?.(review)}
              sx={{
                color: colors.text.primary,
                p: 0.5,
                '&:hover': { bgcolor: `${colors.text.primary}10` },
              }}
            >
              <ViewIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete?.(review.id)}
              sx={{
                color: '#d32f2f',
                p: 0.5,
                '&:hover': { bgcolor: '#d32f2f10' },
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  )
}

export default ReviewsCard
