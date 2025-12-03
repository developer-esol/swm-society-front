import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { colors } from '../../theme';
import type { ShippingFeature } from '../../types/common';

interface OurShippingPolicyProps {
  policyDescription: string;
  shippingFeatures: ShippingFeature[];
}

const iconMap = {
  LocalShipping: LocalShippingIcon,
  AccessTime: AccessTimeIcon,
  Public: PublicIcon,
  CardGiftcard: CardGiftcardIcon,
};

export const OurShippingPolicy: React.FC<OurShippingPolicyProps> = ({
  policyDescription,
  shippingFeatures,
}) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Card sx={{ mb: 4, boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Our Shipping Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.text.lightGray, lineHeight: 1.7, mb: 4 }}
          >
            {policyDescription}
          </Typography>

          {/* Shipping Features Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {shippingFeatures.map((feature) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <Box key={feature.id} sx={{ textAlign: 'center' }}>
                  {IconComponent && (
                    <IconComponent
                      sx={{
                        fontSize: 48,
                        color: colors.icon.primary,
                        mb: 1,
                      }}
                    />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.lightGray }}>
                    {feature.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
