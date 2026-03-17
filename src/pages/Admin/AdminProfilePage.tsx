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
import { Edit as EditIcon, Camera as CameraIcon, Lock as LockIcon } from '@mui/icons-material'
import { useAdminProfile } from '../../hooks/admin/useAdminProfile'
import { authService } from '../../api/services/authService'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'

const AdminProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, updateProfilePicture, changePassword } = useAdminProfile()
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
    department: profile?.department || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',
  })

  React.useEffect(() => {
    if (profile) {
      setEditData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        department: profile.department,
        bio: profile.bio || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
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
    try {
      const result = await authService.requestPasswordReset(profile!.email)
      setSuccessMessage('Password reset link sent to your email!')
      setPasswordDialogOpen(false)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send password reset email'
      alert(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
            My Profile
          </Typography>
          <Typography sx={{ color: colors.text.gray }}>Manage your account settings and preferences</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}

        {/* Profile Header Card */}
        <Card sx={{ mb: 3, p: 4, bgcolor: colors.background.paper, border: `1px solid ${colors.border.default}` }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            {/* Avatar */}
            <Box sx={{ position: 'relative' }}>
              <Avatar sx={{ width: 120, height: 120, bgcolor: colors.button.primary, fontSize: '3rem' }}>
                {profile.firstName[0]}{profile.lastName[0]}
              </Avatar>
              <Box
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: colors.button.primary,
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  '&:hover': { bgcolor: colors.button.primaryHover },
                }}
              >
                <CameraIcon />
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
              </Box>
            </Box>

            {/* Profile Info */}
            <Box sx={{ flex: 1 }}>
              <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Profile', to: '/admin/profile' }]} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
                Profile
              </Typography>
              <Typography sx={{ color: colors.text.gray, mb: 0.5 }}>{profile.email}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray }}>Role</Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.role}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray }}>Status</Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: profile.status === 'active' ? colors.password.primary : colors.status.cancelled,
                    }}
                  >
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray }}>Joined</Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Profile Details */}
        <Card sx={{ mb: 3, p: 4, bgcolor: colors.background.paper, border: `1px solid ${colors.border.default}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
            Personal Information
          </Typography>

          {isEditing ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="First Name"
                value={editData.firstName}
                onChange={handleEditChange('firstName')}
                fullWidth
                size="small"
              />
              <TextField
                label="Last Name"
                value={editData.lastName}
                onChange={handleEditChange('lastName')}
                fullWidth
                size="small"
              />
              <TextField label="Phone" value={editData.phone} onChange={handleEditChange('phone')} fullWidth size="small" />
              <TextField
                label="Department"
                value={editData.department}
                onChange={handleEditChange('department')}
                fullWidth
                size="small"
              />
              <TextField
                label="Address"
                value={editData.address}
                onChange={handleEditChange('address')}
                fullWidth
                size="small"
              />
              <TextField label="City" value={editData.city} onChange={handleEditChange('city')} fullWidth size="small" />
              <TextField
                label="Country"
                value={editData.country}
                onChange={handleEditChange('country')}
                fullWidth
                size="small"
              />
              <TextField
                label="Bio"
                value={editData.bio}
                onChange={handleEditChange('bio')}
                fullWidth
                multiline
                rows={3}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />

              <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2 }}>
                <Button
                  onClick={handleSaveProfile}
                  variant="contained"
                  sx={{ bgcolor: colors.button.primary, '&:hover': { bgcolor: colors.button.primaryHover } }}
                >
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outlined">
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>First Name</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.firstName}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Last Name</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.lastName}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Email</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.email}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Phone</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.phone}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Department</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.department}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Address</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.address}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>City</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.city}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Country</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.country}</Typography>
              </Box>
              {profile.bio && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography sx={{ fontSize: '0.9rem', color: colors.text.gray, mb: 0.5 }}>Bio</Typography>
                  <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>{profile.bio}</Typography>
                </Box>
              )}
            </Box>
          )}
        </Card>

        {/* Security Card */}
        <Card sx={{ p: 4, bgcolor: colors.background.paper, border: `1px solid ${colors.border.default}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
                Security
              </Typography>
              <Typography sx={{ color: colors.text.gray }}>Manage your password and security settings</Typography>
            </Box>
            <Button
              onClick={() => setPasswordDialogOpen(true)}
              startIcon={<LockIcon />}
              variant="contained"
              sx={{ bgcolor: colors.button.primary, '&:hover': { bgcolor: colors.button.primaryHover } }}
            >
              Change Password
            </Button>
          </Box>
        </Card>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: colors.text.primary }}>Reset Password</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              A password reset link will be sent to your email address:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.button.primary, mb: 2 }}>
              {profile?.email}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              The link will expire in 24 hours. Click the link in your email to reset your password.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{ bgcolor: colors.button.primary, '&:hover': { bgcolor: colors.button.primaryHover } }}
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProfilePage
