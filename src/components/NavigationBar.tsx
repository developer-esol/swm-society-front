import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Badge,
    Menu,
    MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart, Favorite, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { useBrands } from '../hooks/useBrands';
import { colors } from '../theme';

export const NavigationBar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [totalItems] = useState<number>(0);
    const [wishlistItems] = useState<number>(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);


    // tanstack query to fetch brands
    const { data: brands } = useBrands();
    const activeBrands = brands ? brands.filter(b => b.isActive) : [];

    const logout = () => {
        // Placeholder logout function
        setIsAuthenticated(false);
        setProfileAnchor(null);
    }
    
    const handleMobileToggle = () => setMobileOpen(!mobileOpen);
    
    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileAnchor(event.currentTarget);
    };
    
    const handleProfileClose = () => {
        setProfileAnchor(null);
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
                            <>
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
                                        Your Orders
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
                                        Your posts
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
                                            logout();
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
                            <>
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
                                            bgcolor: 'white',
                                            color: 'black',
                                            mt: 1,
                                            minWidth: '150px',
                                        }
                                    }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to="/login"
                                        onClick={handleProfileClose}
                                        sx={{ color: 'black', fontWeight: 500 }}
                                    >
                                        Login
                                    </MenuItem>
                                </Menu>
                            </>
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