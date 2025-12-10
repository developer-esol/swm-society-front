import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from '@mui/material';
import { colors } from '../../../theme';
import type { StockItem } from '../../../types/Admin';

const StockViewModal = ({ open, stock, onClose }: { open: boolean; stock: StockItem | null; onClose: () => void }) => {
  if (!stock) return null;

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
    '& .MuiInputLabel-root.Mui-disabled': {
      color: '#000000 !important',
      opacity: '1 !important',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(205, 159, 159, 0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: colors.text.primary,
          borderBottom: `1px solid ${colors.border.default}`,
          fontSize: '1.2rem',
          pb: 2,
        }}
      >
        Stock Details
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <TextField label="Product Name" value={stock.productName} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <TextField label="Color" value={stock.color} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <TextField label="Size" value={stock.size} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <TextField label="Quantity" value={stock.quantity} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <TextField label="Price" value={stock.price} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <TextField label="Image URL" value={stock.imageUrl} disabled fullWidth size="small" variant="outlined" sx={textFieldStyles} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: `1px solid ${colors.border.default}` }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: colors.button.primary,
                color: colors.button.primary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  borderColor: colors.button.primaryHover,
                  bgcolor: `${colors.button.primary}08`,
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StockViewModal;
