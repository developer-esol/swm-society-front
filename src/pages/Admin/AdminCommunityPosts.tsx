import { Box, Container, Typography, Button as MuiButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { communityService } from '../../api/services/communityService'
import { ConfirmDeleteDialog } from '../../components'
import { colors } from '../../theme'
import type { CommunityPost } from '../../types/community'
import AdminCommunityPostCard from '../../components/AdminCommunityPostCard'
import { TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

const AdminCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<{ id: string; caption: string } | null>(null)

  const ITEMS_PER_PAGE = 3

  // Fetch posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await communityService.getAll()
        setPosts(allPosts)
        setFilteredPosts(allPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

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
      await communityService.deletePost(postToDelete.id)
      const updatedPosts = posts.filter((p) => p.id !== postToDelete.id)
      setPosts(updatedPosts)
      setFilteredPosts(updatedPosts)
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

  // Get posts to display
  const displayedPosts = showAll ? filteredPosts : filteredPosts.slice(0, ITEMS_PER_PAGE)
  const hasMorePosts = filteredPosts.length > ITEMS_PER_PAGE

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
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Community Posts
        </Typography>

        {/* Search Bar */}
        <TextField
          placeholder="Search Community Posts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            maxWidth: '350px',
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: colors.background.default,
            },
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ fontSize: '1.2rem', color: colors.button.primary }} />
              </Box>
            ),
          }}
        />

        {/* Posts Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2, mb: 3 }}>
          {displayedPosts.map((post) => (
            <AdminCommunityPostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
        </Box>

        {/* View More Button */}
        {hasMorePosts && !showAll && (
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
