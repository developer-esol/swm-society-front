import React, { useState } from 'react'
import * as Yup from 'yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material'
import { colors } from '../../../theme'

interface EditPointsModalProps {
  open: boolean
  availablePoints: number
  onClose: () => void
  onSave: (points: number, reason: string) => Promise<void>
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  points: Yup.number()
    .typeError('Points must be a number')
    .required('Points is required')
    .positive('Points must be a positive number')
    .integer('Points must be a whole number'),
  reason: Yup.string()
    .required('Reason is required')
    .min(3, 'Reason must be at least 3 characters')
    .max(200, 'Reason must be less than 200 characters')
    .trim(),
})

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

const EditPointsModal: React.FC<EditPointsModalProps> = ({ open, availablePoints, onClose, onSave }) => {
  const [points, setPoints] = useState<number | string>('')
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ points?: string; reason?: string }>({})

  const handleSave = async () => {
    try {
      setErrors({})
      const values = { points: points ? Number(points) : '', reason }
      await validationSchema.validate(values, { abortEarly: false })

      const pointsNum = Number(points)
      setIsLoading(true)
      await onSave(pointsNum, reason)
      handleClose()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: { points?: string; reason?: string } = {}
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof typeof newErrors] = error.message
          }
        })
        setErrors(newErrors)
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPoints('')
    setReason('')
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Add Points
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Current Available Points */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: colors.text.secondary,
                mb: 0.5,
              }}
            >
              Current Available Points
            </Typography>
            <Typography
              sx={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: colors.loyalty.primary,
              }}
            >
              {availablePoints.toLocaleString()}
            </Typography>
          </Box>

          {/* Error Messages */}
          {(errors.points || errors.reason) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {errors.points && (
                <Typography
                  sx={{
                    color: colors.status.error,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {errors.points}
                </Typography>
              )}
              {errors.reason && (
                <Typography
                  sx={{
                    color: colors.status.error,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {errors.reason}
                </Typography>
              )}
            </Box>
          )}

          {/* Points Input */}
          <TextField
            fullWidth
            label="Points to Add"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            variant="outlined"
            size="small"
            error={!!errors.points}
            helperText={errors.points}
            sx={fieldSx}
            InputProps={{
              endAdornment: <InputAdornment position="end">pts</InputAdornment>,
            }}
          />

          {/* Reason Input */}
          <TextField
            fullWidth
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant="outlined"
            size="small"
            multiline
            rows={3}
            error={!!errors.reason}
            helperText={errors.reason}
            placeholder="e.g., Promotional adjustment, Customer reward, etc."
            sx={fieldSx}
          />

          {/* New Balance Preview */}
          <Box
            sx={{
              bgcolor: `${colors.loyalty.primary}15`,
              border: `1.5px solid ${colors.loyalty.primary}`,
              borderRadius: '8px',
              p: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: colors.text.gray,
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              New Balance
            </Typography>
            <Typography
              sx={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: colors.loyalty.primary,
              }}
            >
              {(availablePoints + (Number(points) || 0)).toLocaleString()} pts
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
          borderTop: `1px solid ${colors.border.default}`,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            borderColor: colors.border.default,
            color: colors.text.primary,
            fontWeight: 600,
            '&:hover': {
              borderColor: colors.text.primary,
              bgcolor: `${colors.text.primary}08`,
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          variant="contained"
          sx={{
            backgroundColor: colors.button.primary,
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: colors.button.primaryHover,
            },
            '&:disabled': {
              backgroundColor: colors.border.default,
            },
          }}
        >
          {isLoading ? 'Saving...' : 'Add Points'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditPointsModal
