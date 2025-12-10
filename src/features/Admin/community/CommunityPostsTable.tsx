import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material'
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
  return (
    <Paper sx={{ bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d3d3d3' }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                User Handle
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                User ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Caption
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Likes
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem', textAlign: 'center' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: colors.background.lighter } }}>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    @{post.userHandle}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {post.userId}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {post.caption.substring(0, 50)}...
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    ❤️ {post.likes}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                      <Button
                        onClick={() => onView(post)}
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
                        onClick={() => onEdit(post)}
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
                        <EditIcon size={18} />
                      </Button>
                      <Button
                        onClick={() => onDelete(post.id)}
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ color: colors.text.disabled }}>No community posts found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CommunityPostsTable
