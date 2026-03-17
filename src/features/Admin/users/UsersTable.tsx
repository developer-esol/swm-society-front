import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material'
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { AdminUser } from '../../../types/Admin/users'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'

interface UsersTableProps {
  users: AdminUser[]
  onEdit: (user: AdminUser) => void
  onDelete: (id: string) => void
}

const UsersTable = ({ users, onEdit, onDelete }: UsersTableProps) => {
  const getStatusColors = (status: string) => {
    if (status.toLowerCase() === 'active') {
      return { bg: colors.loyalty.lightGreen, color: colors.loyalty.greenDark }
    }
    return { bg: colors.loyalty.lightRedPink, color: colors.status.error }
  }

  // All users are editable by default; remove role-based hiding

  return (
    <Paper sx={{bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.login.access }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                User ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem', textAlign: 'center' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: colors.background.lighter , lineHeight: 1.43  } }}>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {user.id}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {user.status ? (
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColors(user.status).bg,
                          color: getStatusColors(user.status).color,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {user.role}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                        <Permission permission={PERMISSIONS.UPDATE_USERS}>
                        <Button
                          onClick={() => onEdit(user)}
                          disabled={user.status === 'Inactive'}
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
                            color: user.status === 'Inactive' ? colors.password.disable : colors.text.primary,
                            bgcolor: 'transparent',
                            '&:hover': {
                              bgcolor: user.status === 'Inactive' ? 'transparent' : colors.background.lighter,
                            },
                            '&:disabled': {
                              cursor: 'not-allowed',
                            }
                          }}
                        >
                          <EditIcon size={18} />
                        </Button>
                        </Permission>
                        <Permission permission={PERMISSIONS.DELETE_USERS}>
                      <Button
                        onClick={() => onDelete(user.id)}
                        disabled={user.status === 'Inactive'}
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
                          color: user.status === 'Inactive' ? colors.password.disable : colors.button.primary,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: user.status === 'Inactive' ? 'transparent' : colors.danger.background,
                          },
                          '&:disabled': {
                            cursor: 'not-allowed',
                          }
                        }}
                      >
                        <DeleteIcon size={18} />
                      </Button>
                      </Permission>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ color: colors.text.disabled }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default UsersTable
