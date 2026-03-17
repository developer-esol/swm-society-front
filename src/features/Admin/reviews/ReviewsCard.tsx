import { Card, CardMedia, CardContent, Box, Typography, Button, Rating } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { productsService } from '../../../api/services/products'
import { Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { Review } from '../../../types/review'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'

interface ReviewsCardProps {
  review: Review
  userName?: string | null
  onDelete?: (id: string) => void
}

const ReviewsCard = ({ review, userName, onDelete }: ReviewsCardProps) => {
  // date formatting removed — not used in the compact layout

  return (
    <Card
      sx={{
        textDecoration: 'none',
        mb: 1.5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: review.imageUrl ? 'row' : 'column' },
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Left image column when present */}
      {review.imageUrl && (
        <CardMedia
          component="img"
          image={review.imageUrl}
          alt="review image"
          sx={{
            width: { xs: '100%', sm: 200 },
            height: { xs: 180, sm: '100%' },
            objectFit: 'cover',
            backgroundColor: colors.card.imagePlaceholder,
            flexShrink: 0,
          }}
        />
      )}

      {/* Delete button positioned top-right (styled like admin community delete) */}
      <Permission permission={PERMISSIONS.DELETE_REVIEWS}>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
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
            color: colors.button.primary,
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: colors.danger.background,
            },
          }}
        >
          <DeleteIcon size={18} />
        </Button>
      </Box>
      </Permission>

      <CardContent sx={{ p: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.95rem' }}>
              @{userName ? userName : `user_${review.userId?.slice(0, 8)}`}
            </Typography>
            <Typography sx={{ color: colors.text.disabled, fontSize: '0.75rem' }}>User ID: {review.userId}</Typography>
          </Box>

          {/* Product name and product id */}
          <ProductInfo productId={review.productId} comment={review.comment} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <Rating value={review.rating} readOnly size="small" sx={{ color: colors.danger.yellow }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ReviewsCard

// Small helper component to show product name and id; fetches product by id
function ProductInfo({ productId, comment }: { productId?: string; comment: string }) {
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => (productId ? productsService.getProductById(productId) : Promise.resolve(null)),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      <Typography sx={{ fontWeight: 700, color: colors.text.primary, mt: 1, fontSize: '1rem' }}>
        {product?.name || 'Unknown Product'}
      </Typography>
      <Typography sx={{ color: colors.text.disabled, mb: 1, fontSize: '0.8rem' }}>Product ID: {productId || 'N/A'}</Typography>
      <Typography sx={{ color: colors.text.primary, mt: 1, fontSize: '0.95rem', lineHeight: 1.4 }}>
        {comment}
      </Typography>
    </>
  )
}
