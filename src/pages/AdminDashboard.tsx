import { Box, Container, Typography, Paper } from '@mui/material'
import AdminSidebar from '../components/Admin/AdminSidebar'
import { colors } from '../theme'

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background.default }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: colors.text.primary }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Paper
              sx={{
                p: 3,
                bgcolor: colors.background.light,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <Typography variant="h6" sx={{ color: colors.text.primary }}>
                Dashboard
              </Typography>
              <Typography variant="h4" sx={{ color: colors.button.primary, mt: 1 }}>
                —
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default AdminDashboard
