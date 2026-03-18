import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { Role } from '../../../types/Admin/roles'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

const getRoleColor = (roleName: string) => {
  switch (roleName) {
    case 'Super Admin':
      return colors.button.primary
    case 'Admin':
      return colors.status.processing
    case 'Manager':
      return colors.status.delivered
    case 'Support':
      return colors.status.shipped
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
              {(role as any).usersCount || 0} users
            </Box>
            <Box
              sx={{
                backgroundColor: colors.danger.role,
                color: colors.menu.textSecondary,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
            >
              {role.permissions?.length || 0} permissions
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {!(role.name || '').toLowerCase().trim().includes('admin') && (
          <>
            <Permission permission={PERMISSIONS.UPDATE_ROLES}>
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
            </Permission>
            <Permission permission={PERMISSIONS.DELETE_ROLES}>
            <Button
              onClick={() => onDelete(role)}
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
            </Permission>
          </>
        )}
      </Box>
    </Box>
  )
}

export default RoleCard
