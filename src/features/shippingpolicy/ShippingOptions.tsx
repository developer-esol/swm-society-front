import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { colors } from '../../theme';
import type { ShippingOption } from '../../types/common';

interface ShippingOptionsProps {
  shippingOptions: ShippingOption[];
}

export const ShippingOptions: React.FC<ShippingOptionsProps> = ({ shippingOptions }) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Shipping Options
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${colors.border.default}`, bgcolor: colors.background.light }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.background.lighter }}>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Shipping Method
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Delivery Time
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Cost
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Free Shipping Minimum
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingOptions.map((option) => (
              <TableRow key={option.id} sx={{ '&:hover': { bgcolor: colors.background.light } }}>
                <TableCell sx={{ color: colors.text.primary }}>{option.method}</TableCell>
                <TableCell sx={{ color: colors.text.primary }}>
                  {option.deliveryTime}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary }}>{option.cost}</TableCell>
                <TableCell sx={{ color: colors.text.primary }}>
                  {option.freeShippingMinimum}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
