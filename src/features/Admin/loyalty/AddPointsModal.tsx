import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { colors } from '../../../theme'
import { adminLoyaltyService } from '../../../api/services/admin/loyaltyService'
import { apiClient } from '../../../api/apiClient'

interface AddPointsModalProps {
  open: boolean
  users: Array<{ name: string; id: string; uuid?: string }>
  onClose: () => void
  onSuccess: () => void
}

const AddPointsModal: React.FC<AddPointsModalProps> = ({ open, users, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState<{ name: string; id: string; uuid?: string } | null>(null)
  const [points, setPoints] = useState<string>('')
  const [description, setDescription] = useState('')
  const [availablePoints, setAvailablePoints] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ user?: string; points?: string; description?: string }>({})

  // Fetch user's current balance when user is selected
  useEffect(() => {
    if (!selectedUser || !open) {
      setAvailablePoints(null)
      return
    }

    let cancelled = false
    const loadBalance = async () => {
      try {
        const data = await adminLoyaltyService.getCustomerLoyalty(selectedUser.id)
        if (!cancelled) {
          setAvailablePoints(data.availablePoints)
        }
      } catch (err) {
        console.warn('Could not load balance:', err)
        if (!cancelled) setAvailablePoints(0)
      }
    }
    loadBalance()
    return () => {
      cancelled = true
    }
  }, [selectedUser, open])

  const validate = () => {
    const newErrors: any = {}
    
    if (!selectedUser) {
      newErrors.user = 'Please select a user'
    }
    
    const pointsNum = Number(points)
    if (!points || isNaN(pointsNum) || pointsNum <= 0) {
      newErrors.points = 'Points must be a positive number'
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApply = async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      // Call API to add loyalty points - use UUID if available
      const userId = selectedUser?.uuid || selectedUser!.id
      const body = {
        userId: String(userId),
        points: Number(points),
        source: description.trim(),
      }

      console.log('Selected user:', selectedUser)
      console.log('Using UUID:', userId)
      console.log('Adding loyalty points with body:', body)
      await apiClient.post('/loyalty-points', body)
      
      // Invalidate React Query caches to update UI
      // This will refresh the loyalty balance in navbar and loyalty wallet page
      queryClient.invalidateQueries({ queryKey: ['loyalty', 'balance', userId] })
      queryClient.invalidateQueries({ queryKey: ['loyalty', 'history', userId] })
      
      // Success - close modal and refresh
      handleClose()
      onSuccess()
    } catch (error: any) {
      console.error('Failed to add points:', error)
      setErrors({ description: error?.message || 'Failed to add points. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedUser(null)
    setPoints('')
    setDescription('')
    setAvailablePoints(null)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          color: colors.text.primary,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        Add Loyalty Points
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Available Points Display */}
          <Box
            sx={{
              bgcolor: colors.background.lighter,
              border: `1px solid ${colors.border.default}`,
              borderRadius: '8px',
              p: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.85rem',
                color: colors.text.primary,
                mb: 0.5,
                fontWeight: 600,
              }}
            >
              Current Available Points
            </Typography>
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: 700,
                color: colors.loyalty.yellownew,
              }}
            >
              {availablePoints !== null ? availablePoints.toLocaleString() : '—'}
            </Typography>
          </Box>

          {/* User Dropdown */}
          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.name}
            value={selectedUser}
            onChange={(_e, newValue) => {
              setSelectedUser(newValue)
              setErrors({ ...errors, user: undefined })
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                error={!!errors.user}
                helperText={errors.user}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: colors.input.bg,
                  },
                }}
              />
            )}
          />

          {/* Points Input */}
          <TextField
            fullWidth
            label="Points to Add"
            type="number"
            value={points}
            onChange={(e) => {
              setPoints(e.target.value)
              setErrors({ ...errors, points: undefined })
            }}
            error={!!errors.points}
            helperText={errors.points}
            InputProps={{
              endAdornment: <InputAdornment position="end">pts</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: colors.input.bg,
              },
            }}
          />

          {/* Description Input */}
          <TextField
            fullWidth
            label="Description (Admin Note)"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setErrors({ ...errors, description: undefined })
            }}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            placeholder="e.g., Promotional bonus, Customer compensation, Special reward"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: colors.input.bg,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, borderTop: `1px solid ${colors.border.default}` }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderColor: colors.border.default,
            color: colors.text.primary,
            fontWeight: 600,
            '&:hover': {
              borderColor: colors.text.primary,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          disabled={isLoading}
          variant="contained"
          sx={{
            bgcolor: colors.button.new,
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              bgcolor: colors.button.dark,
            },
          }}
        >
          {isLoading ? 'Adding...' : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPointsModal
