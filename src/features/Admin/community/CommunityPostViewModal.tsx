import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
} from '@mui/material'
import { colors } from '../../../theme'
import type { CommunityPost } from '../../../types/community'

interface CommunityPostViewModalProps {
  open: boolean
  post: CommunityPost | null
  onClose: () => void
}

const CommunityPostViewModal = ({ open, post, onClose }: CommunityPostViewModalProps) => {
  if (!post) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: colors.text.primary }}>
        Community Post Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {/* Post Image */}
          <Card>
            <CardMedia
              component="img"
              image={post.image}
              alt={post.caption}
              sx={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
              }}
            />
          </Card>

          {/* User Info */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
              User Handle: @{post.userHandle}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              User ID: {post.userId}
            </Typography>
          </Box>

          {/* Caption */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
              Caption
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {post.caption}
            </Typography>
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {post.description}
            </Typography>
          </Box>

          {/* Products */}
          {post.products && post.products.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
                Products
              </Typography>
              {post.products.map((product, index) => (
                <Typography key={index} variant="body2" sx={{ color: colors.text.disabled }}>
                  • {product.collection}
                </Typography>
              ))}
            </Box>
          )}

          {/* Likes */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
              ❤️ {post.likes} Likes
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.button.primary }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CommunityPostViewModal
