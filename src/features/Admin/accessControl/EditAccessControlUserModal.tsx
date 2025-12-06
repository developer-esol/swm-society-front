import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material'
import { colors } from '../../../theme'
import type { AccessControlUser } from '../../../types/Admin/accessControl'

interface EditAccessControlUserModalProps {
  open: boolean
  user: AccessControlUser | null
  onClose: () => void
  onSave: (user: AccessControlUser) => void
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.input.bg,
    '& fieldset': {
      borderColor: colors.border.default,
    },
    '&:hover fieldset': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.border.default,
    },
  },
}

const selectSx = {
  bgcolor: colors.input.bg,
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

const EditAccessControlUserModal: React.FC<EditAccessControlUserModalProps> = ({
  open,
  user,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AccessControlUser | null>(user)

  // Update formData when user changes
  if (user && (!formData || formData.id !== user.id)) {
    setFormData(user)
  }

  if (!formData) return null

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      email: e.target.value,
    })
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const value = typeof e.target.value === 'string' ? e.target.value : ''
    setFormData({
      ...formData,
      role: value as 'Super Admin' | 'Manager' | 'User',
    })
  }

  const handleSave = () => {
    if (formData.name.trim() && formData.email.trim() && formData.role) {
      onSave(formData)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          color: colors.text.primary,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        Edit User
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* User Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: colors.text.primary,
                fontSize: '1rem',
              }}
            >
              User Information
            </Typography>

            {/* User ID (Read-only) */}
            <TextField
              fullWidth
              label="User ID"
              value={formData.id}
              disabled
              variant="outlined"
              size="small"
              sx={{ ...fieldSx, mb: 2 }}
            />

            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleNameChange}
              variant="outlined"
              size="small"
              sx={{ ...fieldSx, mb: 2 }}
            />

            {/* Email Address */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              variant="outlined"
              size="small"
              sx={fieldSx}
            />
          </Box>

          {/* Role Assignment Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: colors.text.primary,
                fontSize: '1rem',
              }}
            >
              Role Assignment
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Select Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleRoleChange as React.ChangeEventHandler<HTMLInputElement | { name?: string; value: unknown }>}
                label="Select Role"
                sx={selectSx}
              >
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          p: 2,
          borderTop: `1px solid ${colors.border.default}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: colors.text.primary,
            bgcolor: colors.background.lighter,
            '&:hover': {
              bgcolor: colors.background.light,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'white',
            bgcolor: colors.button.primary,
            '&:hover': {
              bgcolor: colors.button.primaryHover,
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAccessControlUserModal
