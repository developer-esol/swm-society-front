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
import type { AccessControlUser } from '../../../types/Admin/accessControl'

interface AccessControlTableProps {
  users: AccessControlUser[]
  onEdit: (user: AccessControlUser) => void
  onDelete: (id: string) => void
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return '#dc2626'
    case 'Manager':
      return '#10b981'
    case 'User':
      return '#3b82f6'
    default:
      return colors.text.primary
  }
}

const AccessControlTable = ({ users, onEdit, onDelete }: AccessControlTableProps) => {
  return (
    <Paper sx={{ bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d3d3d3' }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem', textAlign: 'center' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { bgcolor: colors.background.lighter } }}>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem', lineHeight: 1.43 }}>
                    <div>{user.name}</div>
                    <div style={{ color: colors.text.disabled, fontSize: '0.8rem' }}>{user.email}</div>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', lineHeight: 1.43 }}>
                    <span
                      style={{
                        backgroundColor: getRoleColor(user.role),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'inline-block',
                      }}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', lineHeight: 1.43 }}>
                    <Button
                      onClick={() => onEdit(user)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: colors.button.primary,
                        px: 1.5,
                        py: 0.2,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(user.id)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: colors.button.primary,
                        px: 1.5,
                        py: 0.2,
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
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

export default AccessControlTable
