import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavigationBar, Footer } from '../components';
import ScrollToTop from '../components/ScrollToTop';

export const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <NavigationBar />
      <ScrollToTop />
      
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