import { Box, Card, CardMedia, CardContent, Typography, Button, Stack } from '@mui/material'
import { Eye as ViewIcon, Edit2 as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { CommunityPost } from '../../../types/community'

interface CommunityPostsTableProps {
  posts: CommunityPost[]
  onView: (post: CommunityPost) => void
  onEdit: (post: CommunityPost) => void
  onDelete: (id: string) => void
}

const CommunityPostsTable = ({ posts, onView, onEdit, onDelete }: CommunityPostsTableProps) => {
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography sx={{ color: colors.text.disabled }}>No community posts found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {posts.map((post) => (
        <Card
          key={post.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: post.image ? 'row' : 'column' },
            overflow: 'hidden',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' },
          }}
        >
          {post.image && (
            <CardMedia
              component="img"
              image={post.image}
              alt="post image"
              sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', backgroundColor: '#f5f5f5' }}
            />
          )}

          <CardContent sx={{ p: 2, flex: 1, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.95rem'  }}>@{post.userHandle}</Typography>
                <Typography sx={{ color: colors.text.disabled, fontSize: '0.75rem' }}>{post.userId}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  onClick={() => onView(post)}
                  sx={{ minWidth: 40, width: 40, height: 40, p: 0, border: `1px solid ${colors.border.default}`, borderRadius: 1, bgcolor: 'transparent' }}
                >
                  <ViewIcon size={18} />
                </Button>
                <Button
                  onClick={() => onEdit(post)}
                  sx={{ minWidth: 40, width: 40, height: 40, p: 0, border: `1px solid ${colors.border.default}`, borderRadius: 1, bgcolor: 'transparent' }}
                >
                  <EditIcon size={18} />
                </Button>
                <Button
                  onClick={() => onDelete(post.id)}
                  sx={{ minWidth: 40, width: 40, height: 40, p: 0, border: `1px solid ${colors.border.default}`, borderRadius: 1, color: '#dc2626', bgcolor: 'transparent', '&:hover': { bgcolor: '#fee2e2' } }}
                >
                  <DeleteIcon size={18} />
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 700, color: colors.text.primary }}>{post.caption.split('\n')[0]}</Typography>
              <Typography sx={{ color: colors.text.primary, mt: 1 }}>{post.caption}</Typography>
              {post.hashtags && post.hashtags.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                  {post.hashtags.slice(0, 3).map((tag, idx) => (
                    <Typography key={idx} sx={{ color: colors.text.primary, fontSize: '0.8rem' }}>#{tag}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default CommunityPostsTable
