import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Badge,
    Button,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart, Favorite } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { useBrands } from '../hooks/useBrands';
import { colors } from '../theme';

export const GuestNavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const [totalItems] = useState<number>(0);
    const [wishlistItems] = useState<number>(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    // tanstack query to fetch brands
    const { data: brands } = useBrands();
    const activeBrands = brands ? brands.filter(b => b.isActive) : [];

    const handleMobileToggle = () => setMobileOpen(!mobileOpen);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    bgcolor: 'black', 
                    color: 'white',
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
                    <Link to="/guest">
                        <Box component="img" src="/image.png" alt="SWMSOCIETY" sx={{ height: { xs: 56, md: 72 } }} />
                    </Link>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <NavLink to="/guest" label="Home" />
                        <DropdownMenu label="Shop" items={activeBrands.map(b => ({ name: b.brandName, path: `/guest/shop?collection=${encodeURIComponent(b.brandName)}` }))} />
                        <DropdownMenu label="Our Story" items={activeBrands.map(b => ({ name: b.brandName, path: `/guest${b.route}-story` }))} />
                        <NavLink to="/guest/community" label="Community" />
                    </Box>

                    {/* Right Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Login Button - Oval Red Button */}
                        <Button
                            onClick={handleLoginClick}
                            sx={{
                                bgcolor: colors.button.primary,
                                color: 'white',
                                borderRadius: '50px',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                '&:hover': {
                                    bgcolor: colors.button.primaryHover,
                                },
                                display: { xs: 'none', md: 'inline-block' },
                            }}
                        >
                            Login
                        </Button>

                        <IconButton component={Link} to="/guest/wishlist" color="inherit" sx={{ fontSize: '1.75rem' }}>
                            <Badge badgeContent={wishlistItems} color="error">
                                <Favorite fontSize="inherit" />
                            </Badge>
                        </IconButton>

                        <IconButton component={Link} to="/guest/cart" color="inherit" sx={{ fontSize: '1.75rem' }}>
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
                    { label: 'Login', to: '/login' },
                ]}
            />
        </>
    );
};
