import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { colors } from '../../theme';

interface NeedMoreInformationProps {
  contactDescription: string;
}

export const NeedMoreInformation: React.FC<NeedMoreInformationProps> = ({ contactDescription }) => {
  return (
    <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Need More Information?
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: colors.text.lightGray, mb: 4, lineHeight: 1.7 }}
        >
          {contactDescription}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: colors.button.primary,
              color: colors.text.secondary,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.button.primaryHover },
            }}
          >
            Contact Us
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: colors.button.primary,
              borderColor: colors.button.primary,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                borderColor: colors.button.primaryHover,
                color: colors.button.primaryHover,
              },
            }}
          >
            View Returns Policy
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
