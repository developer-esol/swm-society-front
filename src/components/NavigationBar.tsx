import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Badge,
    Menu,
    MenuItem,
    Button,
    Typography,
    Tooltip,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart, Favorite, AccountCircle, Stars } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { useBrands } from '../hooks/useBrands';
import { useAuthStore } from '../store/useAuthStore';
import { useLoyaltyBalance } from '../hooks/useLoyalty';
import { POINT_VALUE } from '../configs/loyalty';
import { colors } from '../theme';

export const NavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [totalItems] = useState<number>(0);
    const [wishlistItems] = useState<number>(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

    // Fetch loyalty balance if user is authenticated
    const { data: loyaltyBalance } = useLoyaltyBalance(user?.id);
    const displayedAvailableValue = loyaltyBalance
        ? (typeof loyaltyBalance.availableValue === 'number' && loyaltyBalance.availableValue > 0
            ? loyaltyBalance.availableValue
            : loyaltyBalance.availablePoints * POINT_VALUE)
        : 0;

    // tanstack query to fetch brands
    const { data: brands } = useBrands();
    const activeBrands = brands ? brands.filter(b => b.isActive) : [];

    // Check if user is admin (only Super Admin: 1, Admin: 2)
    const isAdmin = user?.role === '3';
    
    // Regular users have role ID '1' or role name 'USER' (Google OAuth may return name instead of ID)
    const isRegularUser = !user?.role || user.role === '1' || user.role.toLowerCase() === 'user';
    
    // Check if user should see dashboard (any role except regular user)
    const shouldShowDashboard = !isRegularUser;
    
    // Debug logging
    console.log('[NavigationBar] User role:', user?.role, '| isAdmin:', isAdmin, '| shouldShowDashboard:', shouldShowDashboard);

    const handleLogout = () => {
        console.log('NavigationBar: Logging out user');
        logout();
        setProfileAnchor(null);
        navigate('/login');
    }
    
    const handleMobileToggle = () => setMobileOpen(!mobileOpen);
    
    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileAnchor(event.currentTarget);
    };
    
    const handleProfileClose = () => {
        setProfileAnchor(null);
    };

    const storyItems = activeBrands.map(b => {
        const isProjectZero = (b.brandName ?? '').toLowerCase().includes('project zero');
        const route = isProjectZero ? '/project-zero-story' : `${(b.route ?? '').replace(/\/$/, '')}-story`;
        return { name: b.brandName ?? '', path: route };
    });

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    bgcolor: colors.text.primary, 
                    color: colors.background.default,
                    width: '100%',
                    left: 0,
                    right: 0,
                    top: 0,
                    zIndex: 1100,
                }}
            >
                <Toolbar sx={{ 
                    justifyContent: 'space-between', 
                    width: '100%', 
                    maxWidth: '100%', 
                    px: 2,
                    minHeight: { xs: 80, md: 96 },
                    py: 2,
                }}>
                    {/* Logo */}
                    <Link to="/">
                        <Box component="img" src="https://res.cloudinary.com/dmjacs0c9/image/upload/v1768295786/image_sosqdv.png" alt="SWMSOCIETY" sx={{ height: { xs: 56, md: 72 } }} />
                    </Link>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <NavLink to="/" label="Home" />
                            <DropdownMenu label="Shop" items={activeBrands.map(b => ({ name: b.brandName ?? '', path: `/shop?collection=${encodeURIComponent(b.brandName ?? '')}` }))} />
                            <DropdownMenu label="Our Story" items={storyItems} />
                        <NavLink to="/community" label="Community" />
                    </Box>

                    {/* Right Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated ? (
                            <>
                                {/* Loyalty Points Badge */}
                                {loyaltyBalance && (
                                    <Tooltip 
                                            title={`£${displayedAvailableValue.toFixed(2)} discount available`}
                                            arrow
                                        >
                                        <Box
                                            component={Link}
                                            to="/loyalty-wallet"
                                            sx={{
                                                display: { xs: 'none', sm: 'flex' },
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: colors.overlay.dark,
                                                color: colors.text.secondary,
                                                px: 1.5,
                                                py: 0.75,
                                                borderRadius: '20px',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: colors.overlay.darkHover,
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            <Stars sx={{ fontSize: '1.1rem', color: colors.danger.primary }} />
                                            <Typography
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {loyaltyBalance.availablePoints.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                )}
                                
                                <IconButton
                                    onClick={handleProfileClick}
                                    color="inherit"
                                    sx={{ fontSize: '1.75rem' }}
                                >
                                    <AccountCircle fontSize="inherit" />
                                </IconButton>
                                <Menu
                                    anchorEl={profileAnchor}
                                    open={Boolean(profileAnchor)}
                                    onClose={handleProfileClose}
                                    disableScrollLock={true}
                                    PaperProps={{
                                        sx: {
                                            bgcolor: colors.background.light,
                                            color: colors.text.disabled,
                                            mt: 1.5,
                                            minWidth: '180px',
                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border.default}`,
                                        }
                                    }}
                                >
                                    {shouldShowDashboard && (
                                        <MenuItem
                                            component={Link}
                                            to="/admin"
                                            onClick={handleProfileClose}
                                            sx={{
                                                color: colors.text.disabled,
                                                fontSize: '0.95rem',
                                                py: 1.5,
                                                px: 2.5,
                                                '&:hover': {
                                                    bgcolor: colors.background.lighter,
                                                    color: colors.text.gray,
                                                },
                                                fontWeight: 500,
                                            }}
                                        >
                                            {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                                        </MenuItem>
                                    )}
                                    <MenuItem
                                        component={Link}
                                        to="/profile"
                                        onClick={handleProfileClose}
                                        sx={{
                                            color: colors.text.disabled,
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: colors.background.lighter,
                                                color: colors.text.gray,
                                            },
                                            fontWeight: 500,
                                        }}
                                    >
                                        My Profile
                                    </MenuItem>
                                    <MenuItem
                                        component={Link}
                                        to="/orders"
                                        onClick={handleProfileClose}
                                        sx={{
                                            color: colors.text.disabled,
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: colors.background.lighter,
                                                color: colors.text.gray,
                                            },
                                            fontWeight: 500,
                                        }}
                                    >
                                        My Orders
                                    </MenuItem>
                                    <MenuItem
                                        component={Link}
                                        to="/posts"
                                        onClick={handleProfileClose}
                                        sx={{
                                            color: colors.text.disabled,
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: colors.background.lighter,
                                                color: colors.text.gray,
                                            },
                                            fontWeight: 500,
                                        }}
                                    >
                                        My Posts
                                    </MenuItem>
                                    <MenuItem
                                        component={Link}
                                        to="/loyalty-wallet"
                                        onClick={handleProfileClose}
                                        sx={{
                                            color: colors.text.disabled,
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: colors.background.lighter,
                                                color: colors.text.gray,
                                            },
                                            fontWeight: 500,
                                        }}
                                    >
                                        Loyalty Wallet
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                        sx={{
                                            color: colors.text.disabled,
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            px: 2.5,
                                            '&:hover': {
                                                bgcolor: colors.background.lighter,
                                                color: colors.text.gray,
                                            },
                                            fontWeight: 500,
                                        }}
                                    >
                                        Sign Out
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                component={Link}
                                to="/login"
                                variant="contained"
                                sx={{
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    bgcolor: colors.button.primary,
                                    color: colors.text.secondary,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: colors.button.primaryHover,
                                    },
                                }}
                            >
                                Login
                            </Button>
                        )}

                        <IconButton component={Link} to="/wishlist" color="inherit" sx={{ fontSize: '1.75rem' }}>
                            <Badge badgeContent={wishlistItems} color="error">
                                <Favorite fontSize="inherit" />
                            </Badge>
                        </IconButton>

                        <IconButton component={Link} to="/cart" color="inherit" sx={{ fontSize: '1.75rem' }}>
                            <Badge badgeContent={totalItems} color="error">
                                <ShoppingCart fontSize="inherit" />
                            </Badge>
                        </IconButton>

                        {/* Mobile Menu Button */}
                        <IconButton
                            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                            onClick={handleMobileToggle}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <MobileMenu
                open={mobileOpen}
                onClose={handleMobileToggle}
                menuItems={[
                    { label: 'Home', to: '/' },
                    { label: 'Community', to: '/community' },
                    { label: 'Wishlist', to: '/wishlist' },
                    { label: 'Cart', to: '/cart' },
                ]}
            />
        </>
    );
};