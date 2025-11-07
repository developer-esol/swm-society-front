import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Typography,
    Badge,
} from '@mui/material';
import { Menu, ShoppingCart, Favorite, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { useBrands } from '../hooks/useBrands';

export const NavigationBar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [totalItems] = useState<number>(0);
    const [wishlistItems] = useState<number>(0);
    const [mobileOpen, setMobileOpen] = useState(false);


    // tanstack query to fetch brands
    const { data: brands } = useBrands();
    const activeBrands = brands ? brands.filter(b => b.isActive) : [];

    const logout = () => {
        // Placeholder logout function
        setIsAuthenticated(false);
    }
    
    const handleMobileToggle = () => setMobileOpen(!mobileOpen);

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
                    <Link to="/">
                        <Box component="img" src="/image.png" alt="SWMSOCIETY" sx={{ height: { xs: 56, md: 72 } }} />
                    </Link>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <NavLink to="/" label="Home" />
                            <DropdownMenu label="Shop" items={activeBrands.map(b => ({ name: b.brandName, path: `/shop?collection=${encodeURIComponent(b.brandName)}` }))} />
                            <DropdownMenu label="Our Story" items={activeBrands.map(b => ({ name: b.brandName, path: b.route+"-story" }))} />
                        <NavLink to="/community" label="Community" />
                    </Box>

                    {/* Right Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated ? (
                            <Typography
                                variant="body1"
                                sx={{ 
                                    cursor: 'pointer', 
                                    mr: 1,
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                }}
                                onClick={logout}
                            >
                                Logout
                            </Typography>
                        ) : (
                            <IconButton component={Link} to="/login" color="inherit" sx={{ fontSize: '1.75rem' }}>
                                <AccountCircle fontSize="inherit" />
                            </IconButton>
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
                            <Menu />
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