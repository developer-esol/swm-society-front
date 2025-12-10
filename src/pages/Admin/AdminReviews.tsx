import { useState, useEffect } from 'react'
import { Box, TextField, IconButton, Typography, Button as MuiButton, Pagination, Stack } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/AdminBreadcrumbs'
import { reviewService } from '../../api/services/reviewService'
import type { Review } from '../../types/review'
import ReviewsCard from '../../features/Admin/reviews/ReviewsCard'

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading reviews...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Title */}
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Reviews', to: '/admin/reviews' }]} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
          Reviews
        </Typography>

      {/* Search Box */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
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
            {paginatedReviews.map((review) => (
              <ReviewsCard
                key={review.id}
                review={review}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length} reviews
                </Typography>
                <Stack spacing={2} direction="row">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: colors.text.primary,
                        borderColor: colors.border.default,
                        '&.Mui-selected': {
                          backgroundColor: '#dc2626',
                          color: 'white',
                        },
                      },
                    }}
                  />
                </Stack>
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
