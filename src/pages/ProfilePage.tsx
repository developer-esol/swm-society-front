import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  TextField,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Camera as CameraIcon, Lock as LockIcon } from '@mui/icons-material'
import { useUserProfile } from '../hooks/useUserProfile'
import { authService } from '../api/services/authService'
import { colors } from '../theme'

const ProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, updateProfilePicture } = useUserProfile()
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [editData, setEditData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',
    postalCode: profile?.postalCode || '',
  })

  React.useEffect(() => {
    if (profile) {
      setEditData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        postalCode: profile.postalCode || '',
      })
    }
  }, [profile])

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const result = await updateProfilePicture(file)
      if (result.success) {
        setSuccessMessage('Profile picture updated successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    }
  }

  const handleChangePassword = async () => {
    if (!resetEmail) {
      alert('Please enter your email address')
      return
    }
    if (resetEmail !== profile?.email) {
      alert('The email address does not match your registered email')
      return
    }
    try {
      await authService.requestPasswordReset(resetEmail)
      setSuccessMessage('Password reset link sent to your email!')
      setPasswordDialogOpen(false)
      setResetEmail('')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send password reset email'
      alert(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: colors.text.primary }}>
        My Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Profile Picture Section */}
      <Card sx={{ p: 4, mb: 3, border: `1px solid ${colors.border.default}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.avatar}
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
              }}
            >
              {profile.firstName[0]}{profile.lastName[0]}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
              id="profile-picture-upload"
            />
            <label htmlFor="profile-picture-upload">
              <Button
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: colors.button.primary,
                  color: colors.text.secondary,
                  '&:hover': {
                    bgcolor: colors.button.primaryHover,
                  },
                }}
              >
                <CameraIcon fontSize="small" />
              </Button>
            </label>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary }}>
              {profile.firstName.replace(/^User\s*/i, '').trim()} {profile.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {profile.email}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled, mt: 1 }}>
              Member since: {new Date(profile.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Personal Information */}
      <Card sx={{ p: 4, mb: 3, border: `1px solid ${colors.border.default}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: colors.text.primary }}>
          Personal Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            value={`${profile.firstName.replace(/^User\s*/i, '').trim()} ${profile.lastName}`}
            disabled
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            value={profile.email}
            disabled
            fullWidth
            size="small"
          />
        </Box>
      </Card>

      {/* Security */}
      <Card sx={{ p: 4, border: `1px solid ${colors.border.default}` }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
          Security
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LockIcon />}
          onClick={() => setPasswordDialogOpen(true)}
          sx={{
            borderColor: colors.border.default,
            color: colors.text.primary,
          }}
        >
          Change Password
        </Button>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your email address to receive a password reset link:
            </Typography>
            <TextField
              label="Email Address"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter your email"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              The link will expire in 24 hours. Click the link in your email to reset your password.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              bgcolor: colors.button.primary,
              color: colors.text.secondary,
              '&:hover': { bgcolor: colors.button.primaryHover },
            }}
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProfilePage
