import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { GuestNavigationBar, Footer } from '../components';

export const GuestLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Guest Navigation Bar */}
      <GuestNavigationBar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '80px', md: '96px' }, // Account for fixed AppBar height
          minHeight: 'calc(100vh - 80px)', // Ensure minimum height
        }}
      >
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};
