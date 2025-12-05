import { Box, Container, Typography } from '@mui/material'
import { useDashboard } from '../../hooks/admin'
import { StatBoxes, SalesRevenue, RevenueByLocation, TotalSales, TopSellingProducts } from '../../features/Admin/dashboard'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import { colors } from '../../theme'

const AdminDashboard = () => {
  const dashboardData = useDashboard()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <AdminSidebar />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: colors.text.primary }}>
            Dashboard
          </Typography>

          {/* Stat Boxes Feature */}
          <StatBoxes items={dashboardData.statBoxes} />

          {/* Charts Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4, mt: 4 }}>
            <SalesRevenue />
            <RevenueByLocation data={dashboardData.revenueByLocation} />
            <TotalSales data={dashboardData.totalSalesChart} />
          </Box>

          {/* Products Table Feature */}
          <TopSellingProducts products={dashboardData.topProducts} />
        </Container>
      </Box>
    </Box>
  )
}

export default AdminDashboard
