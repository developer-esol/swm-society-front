import { useState, useEffect } from 'react'
import { Box, TextField, IconButton, Typography, Button as MuiButton } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { colors } from '../../theme'
import { reviewService } from '../../api/services/reviewService'
import type { Review } from '../../types/review'
import ReviewsCard from '../../features/Admin/reviews/ReviewsCard'

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  const ITEMS_PER_PAGE = 3

  // Fetch reviews on mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true)
        const mockReviews = reviewService.getMockReviews()
        setReviews(mockReviews)
        setFilteredReviews(mockReviews)
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  // Handle search filter
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query.trim() === '') {
      setFilteredReviews(reviews)
    } else {
      const filtered = reviews.filter(
        (review) =>
          review.userName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.title.toLowerCase().includes(query)
      )
      setFilteredReviews(filtered)
    }
  }

  // Handle delete review
  const handleDelete = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId)
      const updatedReviews = reviews.filter((r) => r.id !== reviewId)
      setReviews(updatedReviews)
      setFilteredReviews(updatedReviews)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  // Handle view review (can be extended for modal)
  const handleView = (review: Review) => {
    console.log('View review:', review)
    // Can add modal view here if needed
  }

  // Get reviews to display
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, ITEMS_PER_PAGE)
  const hasMoreReviews = filteredReviews.length > ITEMS_PER_PAGE

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading reviews...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Title and Search */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
          Customer Reviews
        </Typography>

        {/* Search Box */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search Reviews..."
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                bgcolor: colors.background.default,
              },
            }}
          />
          <IconButton
            sx={{
              bgcolor: '#C62C2B',
              color: 'white',
              borderRadius: 1,
              p: 1,
              '&:hover': { bgcolor: '#A82421' },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Reviews List */}
      <Box>
        {filteredReviews.length > 0 ? (
          <>
            {displayedReviews.map((review) => (
              <ReviewsCard
                key={review.id}
                review={review}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}

            {/* View More Button */}
            {hasMoreReviews && !showAll && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                <MuiButton
                  variant="text"
                  sx={{
                    color: colors.text.primary,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      color: colors.button.primary,
                      bgcolor: 'transparent',
                    },
                  }}
                  onClick={() => setShowAll(true)}
                >
                  View More
                </MuiButton>
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 5,
              bgcolor: colors.background.default,
              border: `1px solid ${colors.border.default}`,
              borderRadius: 1,
            }}
          >
            <Typography sx={{ color: colors.text.secondary }}>No reviews found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AdminReviews
