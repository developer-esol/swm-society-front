import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Badge,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  StorefrontSharp as StockIcon,
  TrendingUp as SalesIcon,
  CardGiftcard as LoyaltyIcon,
  People as UsersIcon,
  Article as PostsIcon,
  RateReview as ReviewsIcon,
  ManageAccounts as RolesIcon,
  Security as AccessIcon,
  SecurityOutlined as SecurityIcon,
  // Collapse/Expand Icon
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  // Mobile Menu Icons
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import type { SidebarMenuItem } from '../../types/Admin/sidebar';

const DRAWER_WIDTH = 230;

const menuItems: SidebarMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin', badge: 0 },
  { id: 'products', label: 'Products', icon: 'products', path: '/admin/products', badge: 0 },
  { id: 'stock', label: 'Stock', icon: 'stock', path: '/admin/stock', badge: 0 },
  { id: 'sales', label: 'Sales', icon: 'sales', path: '/admin/sales', badge: 0 },
  { id: 'loyalty', label: 'Loyalty', icon: 'loyalty', path: '/admin/loyalty', badge: 0 },
  { id: 'users', label: 'Users', icon: 'users', path: '/admin/users', badge: 0 },
  { id: 'posts', label: 'Posts', icon: 'posts', path: '/admin/posts', badge: 0 },
  { id: 'reviews', label: 'Reviews', icon: 'reviews', path: '/admin/reviews', badge: 0 },
  { id: 'roles', label: 'Roles', icon: 'roles', path: '/admin/roles', badge: 0 },
  { id: 'access', label: 'Access Control', icon: 'access', path: '/admin/access-control', badge: 0 },
];

interface AdminSidebarProps {
  activeMenu?: string;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeMenu, onCollapseChange }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Debug: Log mobile status
  React.useEffect(() => {
    console.log('AdminSidebar - isMobile:', isMobile);
  }, [isMobile])

  const handleCollapseToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: colors.background.default,
        borderRight: `1px solid ${colors.border.default}`,
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          p: 2,
          bgcolor: colors.overlay.dark,
          color: colors.text.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 85,
          maxHeight: 85,
          flexShrink: 0,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src="/image.png"
          alt="SWM Society"
          style={{
            height: '100%',
            maxHeight: '75px',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
        {/* Close button for mobile */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              color: colors.text.secondary,
              padding: '4px',
              '&:hover': {
                bgcolor: colors.overlay.darkHover,
              },
            }}
            size="small"
          >
            <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        )}
        {/* Collapse button for desktop */}
        {!isMobile && (
          <IconButton
            onClick={() => handleCollapseToggle()}
            sx={{
              color: colors.text.secondary,
              padding: '4px',
              '&:hover': {
                bgcolor: colors.overlay.darkHover,
              },
            }}
            size="small"
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      {/* User Profile Section - Hidden for cleaner design */}

      {/* Navigation Menu */}
      <List sx={{ flex: 1, overflow: 'auto', py: 1, px: 0.75, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: colors.border.default, borderRadius: '3px', '&:hover': { bgcolor: colors.text.gray } } }}>
        {menuItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            component="li"
            sx={{
              px: 1.75,
              py: 1,
              my: 0.25,
              display: 'flex',
              alignItems: 'center',
              gap: 1.75,
              borderRadius: 0.75,
              cursor: 'pointer',
              color: activeMenu === item.id ? colors.button.primary : colors.text.gray,
              bgcolor: activeMenu === item.id ? colors.background.lighter : 'transparent',
              border: activeMenu === item.id ? `1px solid ${colors.border.default}` : '1px solid transparent',
              '&:hover': {
                bgcolor: colors.background.lighter,
                color: colors.text.primary,
              },
              transition: 'all 0.2s ease',
              listStyle: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', minWidth: '22px' }}>
              {item.icon === 'dashboard' && <DashboardIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'products' && <ProductsIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'stock' && <StockIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'sales' && <SalesIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'loyalty' && <LoyaltyIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'users' && <UsersIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'posts' && <PostsIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'reviews' && <ReviewsIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'roles' && <RolesIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
              {item.icon === 'access' && <AccessIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.925rem',
                flex: 1,
                letterSpacing: '0.3px',
              }}
            >
              {item.label}
            </Typography>
            {item.badge ? (
              <Badge
                badgeContent={item.badge}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: colors.button.primary,
                    color: colors.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  },
                }}
              />
            ) : null}
          </Box>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 0.75, borderTop: `1px solid ${colors.border.default}`, flexShrink: 0 }}>
        <Box
          onClick={handleLogout}
          component="button"
          sx={{
            px: 1.75,
            py: 1,
            width: '100%',
            borderRadius: 0.75,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            color: colors.button.primary,
            bgcolor: 'transparent',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: `${colors.button.primary}10`,
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem' }}>
            <SecurityIcon sx={{ color: 'inherit', fontSize: '1.15rem' }} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: '0.925rem',
              letterSpacing: '0.3px',
            }}
          >
            Log out
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Toggle - Only show when drawer is closed */}
      {isMobile && !mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1300,
            pointerEvents: 'auto',
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              bgcolor: colors.overlay.dark,
              color: 'white',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: colors.overlay.darkHover,
              },
            }}
          >
            <MenuIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Box>
      )}

      {/* Desktop Drawer */}
      {!isMobile ? (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: `2px 0 8px rgba(0, 0, 0, 0.1)`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Mobile Drawer */
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Spacer for Desktop */}
      {!isMobile && <Box sx={{ width: DRAWER_WIDTH }} />}
    </>
  );
};

export default AdminSidebar;
