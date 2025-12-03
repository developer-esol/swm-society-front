import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors } from '../../theme';
import type { ReturnFeature } from '../../types/common';

interface OurReturnPolicyProps {
  policyDescription: string;
  returnFeatures: ReturnFeature[];
}

const iconMap = {
  AssignmentReturn: AssignmentReturnIcon,
  LocalShipping: LocalShippingIcon,
  CheckCircle: CheckCircleIcon,
};

export const OurReturnPolicy: React.FC<OurReturnPolicyProps> = ({
  policyDescription,
  returnFeatures,
}) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Card sx={{ mb: 4, boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Our Return Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.text.lightGray, lineHeight: 1.7, mb: 4 }}
          >
            {policyDescription}
          </Typography>

          {/* Return Features Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {returnFeatures.map((feature) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <Box key={feature.id} sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                    <IconComponent
                      sx={{
                        fontSize: 48,
                        color: colors.icon.primary,
                      }}
                    />
                  </Box>
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
