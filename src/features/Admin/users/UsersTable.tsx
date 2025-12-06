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
} from '@mui/material'
import { colors } from '../../../theme'
import type { AdminUser } from '../../../types/Admin/users'

interface UsersTableProps {
  users: AdminUser[]
  onDelete: (id: string) => void
}

const UsersTable = ({ users, onDelete }: UsersTableProps) => {
  return (
    <Paper sx={{bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d3d3d3' }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                User ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Status
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
                    {user.status}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => onDelete(user.id)}
                      disabled={user.status === 'Inactive'}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        px: 2,
                        py: 0.25,
                        borderRadius: '6px',
                        color: 'white',
                        bgcolor: user.status === 'Inactive' ? '#d3d3d3' : '#d32f2f',
                        '&:hover': {
                          bgcolor: user.status === 'Inactive' ? '#d3d3d3' : '#b71c1c',
                        },
                        '&:disabled': {
                          color: '#9e9e9e',
                          bgcolor: '#d3d3d3',
                          opacity: 0.7,
                          cursor: 'not-allowed',
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
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
