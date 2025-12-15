import { useState, useMemo, type ChangeEvent } from 'react'
import { Box, TextField, IconButton, Typography, Pagination, Stack } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useQuery, useQueryClient, useQueries } from '@tanstack/react-query'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import { reviewService } from '../../api/services/reviewService'
import { userService } from '../../api/services/admin/userService'
import { ConfirmDeleteDialog } from '../../components'
import type { Review } from '../../types/review'
import ReviewsCard from '../../features/Admin/reviews/ReviewsCard'

const AdminReviews = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()
  const [/*userNamesState*/, /*setUserNames*/] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)

  const ITEMS_PER_PAGE = 5

  // Use React Query so devtools see the API requests
  const { data: reviews = [], isLoading: loading } = useQuery({
    queryKey: ['admin', 'reviews', 1, 100],
    queryFn: () => reviewService.getAllReviews(1, 100),
    staleTime: 1000 * 60 * 2,
  })

  // Derive unique user IDs from reviews
  const uniqueUserIds = useMemo(() => Array.from(new Set(reviews.map((r) => r.userId).filter(Boolean))) as string[], [reviews])

  // Use useQueries to fetch user details for each unique id (no useEffect)
  const userQueries = useQueries({
    queries: uniqueUserIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => userService.getById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    })),
  })

  // Map results to a simple id->name map for rendering
  const userNames = useMemo(() => {
    const map: Record<string, string> = {}
    userQueries.forEach((q, idx) => {
      const id = uniqueUserIds[idx]
      if (q.data && id) map[id] = q.data.name || q.data.email || ''
    })
    return map
  }, [userQueries, uniqueUserIds])

  // Handle search filter
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
  }

  // Request delete: open dialog
  const requestDelete = (reviewId: string) => {
    const r = reviews.find((x) => x.id === reviewId) || null
    setReviewToDelete(r)
    setDeleteDialogOpen(true)
  }

  // Confirm delete: call API and invalidate
  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return
    try {
      await reviewService.deleteReview(reviewToDelete.id)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    } catch (error) {
      console.error('Error deleting review:', error)
      window.alert('Failed to delete review. See console for details.')
    } finally {
      setDeleteDialogOpen(false)
      setReviewToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setReviewToDelete(null)
  }

  // (view handler removed — not used)

  // Calculate pagination
  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter(
      (review) => (review.userId || '').toLowerCase().includes(q) || (review.comment || '').toLowerCase().includes(q)
    )
  }, [reviews, searchQuery])

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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2, mb: 3 }}>        {filteredReviews.length > 0 ? (
          <>
            {paginatedReviews.map((review) => (
              <ReviewsCard
                key={review.id}
                review={review}
                userName={userNames[review.userId]}
                onDelete={requestDelete}
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
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Delete Review"
        message={`Are you sure you want to delete this review by "${reviewToDelete?.userId?.slice(0,8) || ''}"? This action will soft-delete the review.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  )
}

export default AdminReviews
