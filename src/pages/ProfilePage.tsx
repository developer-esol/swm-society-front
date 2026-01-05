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

  Grid,
} from '@mui/material'
import { Edit as EditIcon, Camera as CameraIcon, Lock as LockIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'
import { useUserProfile } from '../hooks/useUserProfile'
import { colors } from '../theme'

const ProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, updateProfilePicture, changePassword } = useUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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

  const handleEditChange = (field: keyof typeof editData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [field]: e.target.value })
  }

  const handleSaveProfile = async () => {
    const result = await updateProfile(editData)
    if (result.success) {
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

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
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    const result = await changePassword(currentPassword, newPassword)
    if (result.success) {
      setSuccessMessage('Password changed successfully!')
      setPasswordDialogOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccessMessage(null), 3000)
    } else {
      alert(result.error || 'Failed to change password')
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
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled }}>
              {profile.email}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.disabled, mt: 1 }}>
              Member since: {new Date(profile.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{
                  bgcolor: colors.button.primary,
                  color: colors.text.secondary,
                  '&:hover': { bgcolor: colors.button.primaryHover },
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  sx={{
                    bgcolor: colors.button.primary,
                    color: colors.text.secondary,
                    '&:hover': { bgcolor: colors.button.primaryHover },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditing(false)}
                  sx={{
                    borderColor: colors.border.default,
                    color: colors.text.primary,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Card>

      {/* Personal Information */}
      <Card sx={{ p: 4, mb: 3, border: `1px solid ${colors.border.default}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: colors.text.primary }}>
          Personal Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="First Name"
              value={isEditing ? editData.firstName : profile.firstName}
              onChange={handleEditChange('firstName')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name"
              value={isEditing ? editData.lastName : profile.lastName}
              onChange={handleEditChange('lastName')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Email"
              value={profile.email}
              disabled
              fullWidth
              size="small"
            />
            <TextField
              label="Phone"
              value={isEditing ? editData.phone : profile.phone}
              onChange={handleEditChange('phone')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
          </Box>
          <TextField
            label="Bio"
            value={isEditing ? editData.bio : profile.bio}
            onChange={handleEditChange('bio')}
            disabled={!isEditing}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
        </Box>
      </Card>

      {/* Address Information */}
      <Card sx={{ p: 4, mb: 3, border: `1px solid ${colors.border.default}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: colors.text.primary }}>
          Address Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Address"
            value={isEditing ? editData.address : profile.address}
            onChange={handleEditChange('address')}
            disabled={!isEditing}
            fullWidth
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="City"
              value={isEditing ? editData.city : profile.city}
              onChange={handleEditChange('city')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
            <TextField
              label="Postal Code"
              value={isEditing ? editData.postalCode : profile.postalCode}
              onChange={handleEditChange('postalCode')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
            <TextField
              label="Country"
              value={isEditing ? editData.country : profile.country}
              onChange={handleEditChange('country')}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
          </Box>
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
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              size="small"
            />
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
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProfilePage
