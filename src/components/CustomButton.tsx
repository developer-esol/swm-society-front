import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '../theme';

interface CustomButtonProps {
  text: string;
  onClick?: () => void;
  width?: string | number;
  height?: string | number;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  sx?: SxProps<Theme>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  width = 'auto',
  height = 'auto',
  disabled = false,
  type = 'button',
  sx,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      type={type}
      disabled={disabled}
      sx={{
        bgcolor: colors.button.primary,
        color: colors.text.secondary,
        px: 3,
        width,
        height,
        '&:hover': {
          bgcolor: colors.button.primaryHover,
        },
        '&:disabled': {
          bgcolor: colors.button.primaryDisabled,
          color: colors.text.secondary,
        },
        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;