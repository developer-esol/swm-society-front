import { Box, Container, Typography, Button as MuiButton, TextField, IconButton, Pagination, Stack } from '@mui/material'
import { useState, useEffect } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { useAdminCommunity } from '../../hooks/useCommunity'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { communityService } from '../../api/services/communityService'
import { QUERY_KEYS } from '../../configs/queryKeys'
import { ConfirmDeleteDialog } from '../../components'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import { colors } from '../../theme'
import type { CommunityPost } from '../../types/community'
import AdminCommunityPostCard from '../../components/Admin/AdminCommunityPostCard'

const AdminCommunityPosts = () => {
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<{ id: string; caption: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  const { data: posts = [], isLoading: postsLoading } = useAdminCommunity()
  const loading = postsLoading

  // initialize filtered posts when posts change
  useEffect(() => {
    setFilteredPosts(posts)
  }, [posts])

  const queryClient = useQueryClient()

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => communityService.deletePost(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.community.admin })
    },
  })

  // Handle search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === '') {
      setFilteredPosts(posts)
    } else {
      const lowerQuery = query.toLowerCase()
      const filtered = posts.filter(
        (post) =>
          post.userName.toLowerCase().includes(lowerQuery) ||
          post.userHandle.toLowerCase().includes(lowerQuery) ||
          post.caption.toLowerCase().includes(lowerQuery) ||
          post.description.toLowerCase().includes(lowerQuery)
      )
      setFilteredPosts(filtered)
    }
  }

  // Handle delete post
  const handleDeletePost = (post: CommunityPost) => {
    setPostToDelete({ id: post.id, caption: post.caption })
    setDeleteDialogOpen(true)
  }

  const confirmDeletePost = async () => {
    if (!postToDelete) return
    try {
      await deletePostMutation.mutateAsync(postToDelete.id)
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading posts...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Community Posts', to: '/admin/community-posts' }]} />
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Community Posts
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
              placeholder="Search Community Posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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

        {/* Posts Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2, mb: 3 }}>
          {paginatedPosts.map((post) => (
            <AdminCommunityPostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
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

        {/* No posts message */}
        {filteredPosts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 5,
              bgcolor: colors.background.default,
              border: `1px solid ${colors.border.default}`,
              borderRadius: 1,
            }}
          >
            <Typography sx={{ color: colors.text.disabled }}>No community posts found</Typography>
          </Box>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        message={`Are you sure you want to delete "${postToDelete?.caption}"? This action cannot be undone.`}
        onConfirm={confirmDeletePost}
        onCancel={cancelDelete}
      />
    </Box>
  )
}

export default AdminCommunityPosts
