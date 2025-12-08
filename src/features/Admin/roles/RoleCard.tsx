import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { Role } from '../../../types/Admin/roles'

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (id: string) => void
}

const getRoleColor = (roleName: string) => {
  switch (roleName) {
    case 'Super Admin':
      return '#dc2626'
    case 'Admin':
      return '#3b82f6'
    case 'Manager':
      return '#10b981'
    case 'Support':
      return '#f59e0b'
    default:
      return colors.button.primary
  }
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
  const roleColor = getRoleColor(role.name)

  return (
    <Box
      sx={{
        p: 3,
        border: `1px solid ${colors.border.default}`,
        borderRadius: '8px',
        bgcolor: colors.background.default,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover': { bgcolor: colors.background.lighter },
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            bgcolor: roleColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, color: '#000000', fontSize: '1rem' }}>
            {role.name}
          </Typography>
          <Typography sx={{ color: '#000000', fontSize: '0.85rem' }}>
            {role.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Box
              sx={{
                backgroundColor: `${roleColor}20`,
                color: roleColor,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
            >
              {role.usersCount} users
            </Box>
            <Box
              sx={{
                backgroundColor: '#e5e5e5',
                color: '#666666',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
            >
              {role.permissionsCount} permissions
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          onClick={() => onEdit(role)}
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
          onClick={() => onDelete(role.id)}
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
    </Box>
  )
}

export default RoleCard
