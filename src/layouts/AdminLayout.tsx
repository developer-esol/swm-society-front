import React, { useState } from 'react'
import { Box, useMediaQuery, useTheme, IconButton } from '@mui/material'
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/Admin/AdminSidebar'
import AdminNavbar from '../components/Admin/AdminNavbar'
import { colors } from '../theme'

interface AdminLayoutProps {
  activeMenu?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isCollapsed, setIsCollapsed] = useState(false)
  const DRAWER_WIDTH = 230
  const COLLAPSED_WIDTH = 72

  // Determine active menu based on current path
  const getActiveMenu = () => {
    const path = location.pathname
    if (path === '/admin' || path === '/admin/') {
      return 'dashboard'
    } else if (path.includes('/admin/products') || path.includes('/admin/add-product')) {
      return 'products'
    } else if (path.includes('/admin/stock') || path.includes('/admin/add-stock')) {
      return 'stock'
    } else if (path.includes('/admin/sales')) {
      return 'sales'
    } else if (path.includes('/admin/loyalty')) {
      return 'loyalty'
    } else if (path.includes('/admin/users')) {
      return 'users'
    } else if (path.includes('/admin/posts')) {
      return 'posts'
    } else if (path.includes('/admin/reviews')) {
      return 'reviews'
    } else if (path.includes('/admin/roles')) {
      return 'roles'
    } else if (path.includes('/admin/access-control')) {
      return 'access'
    }
    return ''
  }

  const activeMenu = getActiveMenu()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      {/* Admin Navbar */}
      <AdminNavbar drawerWidth={DRAWER_WIDTH} />

      {/* Main Content with Sidebar */}
      <Box sx={{ display: 'flex', flex: 1, mt: { xs: '80px', md: '85px' }, position: 'relative' }}>
        {/* Sidebar - Always render on desktop */}
        {!isMobile && (
          <Box sx={{ width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH, flexShrink: 0 }}>
            <AdminSidebar activeMenu={activeMenu} onCollapseChange={setIsCollapsed} />
          </Box>
        )}

        {/* Mobile Sidebar - AdminSidebar renders its own mobile drawer */}
        {isMobile && (
          <AdminSidebar activeMenu={activeMenu} onCollapseChange={setIsCollapsed} />
        )}

        {/* Toggle Sidebar Button - Shows when sidebar is collapsed */}
        {!isMobile && isCollapsed && (
          <IconButton
            onClick={() => setIsCollapsed(false)}
            sx={{
              position: 'fixed',
              left: 16,
              top: { xs: 90, md: 100 },
              bgcolor: colors.overlay.dark,
              color: colors.text.secondary,
              zIndex: 999,
              '&:hover': {
                bgcolor: colors.overlay.darkHover,
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH}px)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
