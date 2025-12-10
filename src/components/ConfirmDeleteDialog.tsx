import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { colors } from '../theme';
import type { ConfirmDeleteDialogProps } from '../types';

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  title = 'Confirm Delete',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle 
        sx={{ 
          fontWeight: 700, 
          color: colors.text.primary,
          fontSize: '1.2rem',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: colors.text.primary, fontSize: '1rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: colors.border.default,
            color: colors.text.primary,
            '&:hover': {
              backgroundColor: colors.background.lighter,
              borderColor: colors.border.default,
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#dc2626',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};