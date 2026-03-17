import { Box, Container, Typography } from '@mui/material'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import { useDashboard } from '../../hooks/admin'
import { StatBoxes, SalesRevenue, RevenueByLocation, TotalSales, TopSellingProducts } from '../../features/Admin/dashboard'
import { colors } from '../../theme'
import { Permission } from '../../components/Permission'
import { PERMISSIONS } from '../../configs/permissions'
import { usePermissionsStore } from '../../store/usePermissionsStore'

const AdminDashboard = () => {
  const dashboardData = useDashboard()
  const { hasPermission } = usePermissionsStore()

  // Filter stat boxes based on permissions
  const filteredStatBoxes = dashboardData.statBoxes.filter((statBox) => {
    if (statBox.label === 'TOTAL PRODUCTS') {
      return hasPermission(PERMISSIONS.VIEW_PRODUCTS)
    }
    if (statBox.label === 'TOTAL USERS') {
      return hasPermission(PERMISSIONS.VIEW_USERS)
    }
    if (statBox.label === 'ORDERS') {
      return hasPermission(PERMISSIONS.VIEW_SALES)
    }
    return true // Show other stat boxes by default
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Dashboard' }]} />
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: colors.text.primary }}>
          Dashboard
        </Typography>

        {/* Stat Boxes Feature - Filtered by permissions */}
        {filteredStatBoxes.length > 0 && <StatBoxes items={filteredStatBoxes} />}

        {/* Charts Grid - Wrapped with permissions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4, mt: 4 }}>
          <Permission permission={PERMISSIONS.VIEW_SALES}>
            <SalesRevenue />
          </Permission>
          <Permission permission={PERMISSIONS.VIEW_SALES}>
            <RevenueByLocation data={dashboardData.revenueByLocation} />
          </Permission>
          <Permission permission={PERMISSIONS.VIEW_SALES}>
            <TotalSales data={dashboardData.totalSalesChart} />
          </Permission>
        </Box>

        {/* Products Table Feature - Wrapped with VIEW_PRODUCTS permission */}
        <Permission permission={PERMISSIONS.VIEW_PRODUCTS}>
          <TopSellingProducts products={dashboardData.topProducts} />
        </Permission>
      </Container>
    </Box>
  )
}

export default AdminDashboard
