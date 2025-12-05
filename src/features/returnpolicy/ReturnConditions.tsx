import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { colors } from '../../theme';
import type { ReturnCondition } from '../../types/common';

interface ReturnConditionsProps {
  eligibleConditions: ReturnCondition[];
  notEligibleConditions: ReturnCondition[];
}

export const ReturnConditions: React.FC<ReturnConditionsProps> = ({
  eligibleConditions,
  notEligibleConditions,
}) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Return Conditions
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Eligible for Returns */}
        <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 24,
                  color: colors.status.success,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary, ml: 1 }}>
                Eligible for Returns
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {eligibleConditions.map((condition) => (
                <ListItem key={condition.id} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: colors.status.success, fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={condition.text}
                    primaryTypographyProps={{ variant: 'body2', color: colors.text.primary }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Not Eligible for Returns */}
        <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CancelIcon
                sx={{
                  fontSize: 24,
                  color: colors.status.error,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary, ml: 1 }}>
                Not Eligible for Returns
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {notEligibleConditions.map((condition) => (
                <ListItem key={condition.id} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CancelIcon sx={{ color: colors.status.error, fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={condition.text}
                    primaryTypographyProps={{ variant: 'body2', color: colors.text.primary }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
