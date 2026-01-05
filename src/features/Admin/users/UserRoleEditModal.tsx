import { Dialog, DialogTitle, DialogContent, Box, Button, FormControl, InputLabel, Select, MenuItem, Alert, TextField } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useEffect } from 'react'
import { colors } from '../../../theme'
import type { AdminUser } from '../../../types/Admin/users'

interface UserRoleEditModalProps {
  open: boolean
  user: AdminUser | null
  roles: Array<{ id: string | number; name: string }>
  onClose: () => void
  onSave: (userId: string, roleId: number, numericId?: number) => Promise<void>
}

const UserRoleEditModal = ({ open, user, roles, onClose, onSave }: UserRoleEditModalProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Update selected role when user changes
  useEffect(() => {
    if (user) {
      // Try to use roleId first, otherwise find by role name
      if (user.roleId !== undefined) {
        setSelectedRoleId(String(user.roleId))
      } else {
        const userRole = roles.find((r) => r.name === user.role || String(r.id) === String(user.role))
        setSelectedRoleId(userRole ? String(userRole.id) : '')
      }
    }
    // Reset states when modal opens/closes
    setError(null)
    setSuccess(null)
  }, [user, roles, open])

  if (!user) return null

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.background.default,
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      '& .MuiOutlinedInput-input': {
        color: '#5f5959ff !important',
        WebkitTextFillColor: '#5f5a5aff !important',
        opacity: '1 !important',
        fontSize: '1rem',
      },
      '& fieldset': {
        borderColor: colors.border.default,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#000000ff !important',
    },
  }

  const selectSx = {
    bgcolor: colors.background.default,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
  }

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    if (error) setError(null)
    if (success) setSuccess(null)
    setSelectedRoleId(e.target.value)
  }

  const handleSave = async () => {
    if (!selectedRoleId) {
      setError('Please select a role')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const roleIdNumber = parseInt(selectedRoleId)
      await onSave(user.id, roleIdNumber, user.numericId)
      setSuccess('User role updated successfully!')
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      console.error('Error updating user role:', err)
      setError('Failed to update user role. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          fontWeight: 700, 
          color: colors.text.primary,
          borderBottom: `1px solid ${colors.border.default}`,
          pb: 2,
        }}
      >
        Edit User Role
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User ID - Disabled */}
          <TextField
            label="User ID"
            value={user.id}
            disabled
            fullWidth
            sx={textFieldStyles}
          />

          {/* Email - Disabled */}
          <TextField
            label="Email"
            value={user.email}
            disabled
            fullWidth
            sx={textFieldStyles}
          />

          {/* Role Selection */}
          <FormControl fullWidth>
            <InputLabel 
              id="role-select-label"
              sx={{
                color: '#000000ff !important',
                '&.Mui-focused': {
                  color: '#000000ff !important',
                },
              }}
            >
              Role
            </InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRoleId}
              label="Role"
              onChange={handleRoleChange}
              disabled={isLoading}
              sx={selectSx}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={String(role.id)}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                px: 3,
                py: 1,
                color: colors.text.primary,
                border: `1px solid ${colors.border.default}`,
                '&:hover': {
                  bgcolor: colors.background.lighter,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !selectedRoleId}
              variant="contained"
              sx={{
                px: 3,
                py: 1,
                bgcolor: colors.button.primary,
                color: 'white',
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
                '&:disabled': {
                  bgcolor: colors.button.disabled,
                  color: colors.text.disabled,
                },
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default UserRoleEditModal
