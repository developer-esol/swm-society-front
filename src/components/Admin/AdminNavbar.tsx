import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { AccountCircle, Logout, Home } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { colors } from '../../theme'

interface AdminNavbarProps {
  drawerWidth?: number
}

const AdminNavbar: React.FC<AdminNavbarProps> = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    navigate('/admin/profile')
    handleClose()
  }

  const handleWebsite = () => {
    navigate('/')
    handleClose()
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    navigate('/login')
    handleClose()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#000000',
        color: 'white',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          minHeight: { xs: '80px', md: '85px' },
          py: 2,
          pr: { xs: 2, md: 3 },
        }}
      >
        {/* Profile Icon and Dropdown */}
        <Tooltip title="Account">
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <AccountCircle sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Tooltip>

        {/* Dropdown Menu */}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'hidden',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              backgroundColor: colors.background.default,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={handleProfile}
            sx={{
              color: colors.text.primary,
              '&:hover': {
                backgroundColor: colors.background.lighter,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Profile
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleWebsite}
            sx={{
              color: colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: colors.background.lighter,
              },
            }}
          >
            <Home sx={{ fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Website
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: colors.status.error,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: `${colors.status.error}10`,
              },
            }}
          >
            <Logout sx={{ fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default AdminNavbar
