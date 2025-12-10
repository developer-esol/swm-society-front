import { Box, Container, Typography, Pagination, Stack, TextField, IconButton } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import AdminBreadcrumbs from '../../components/AdminBreadcrumbs'
import { useAdminSales } from '../../hooks/admin'
import { SalesTable } from '../../features/Admin/sales'
import { colors } from '../../theme'

const AdminSales = () => {
  const {
    transactions,
    filteredTransactions,
    currentPage,
    totalPages,
    searchQuery,
    fromDate,
    toDate,
    handleSearch,
    handlePageChange: handlePageChangeHook,
    handleDateFilterChange,
  } = useAdminSales()

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    handlePageChangeHook(page)
  }

  const handleDateChange = (from: string, to: string) => {
    handleDateFilterChange(from, to)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        {/* Header */}
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Sales', to: '/admin/sales' }]} />
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Sales
        </Typography>

        {/* Search Box with Date Filters */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search Sales..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              size="small"
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: colors.background.default,
                },
              }}
            />
            <IconButton
              sx={{
                bgcolor: '#C62C2B',
                color: 'white',
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: '#A82421' },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          
          {/* Date Range Inputs */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.95rem', color: colors.text.primary, fontWeight: 500, whiteSpace: 'nowrap' }}>From:</Typography>
              <Box
                component="input"
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, toDate)}
                sx={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.default}`,
                  fontSize: '0.9rem',
                  color: colors.text.primary,
                  bgcolor: colors.background.default,
                  width: '150px',
                  '&:focus': {
                    outline: 'none',
                    borderColor: colors.border.default,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.95rem', color: colors.text.primary, fontWeight: 500, whiteSpace: 'nowrap' }}>To:</Typography>
              <Box
                component="input"
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange(fromDate, e.target.value)}
                sx={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.default}`,
                  fontSize: '0.9rem',
                  color: colors.text.primary,
                  bgcolor: colors.background.default,
                  width: '150px',
                  '&:focus': {
                    outline: 'none',
                    borderColor: colors.border.default,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Sales Table */}
        <SalesTable 
          transactions={transactions}
        />

       {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
                    {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </Typography>
                  <Stack spacing={2} direction="row">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: colors.text.primary,
                          borderColor: colors.border.default,
                          '&.Mui-selected': {
                            backgroundColor: '#dc2626',
                            color: 'white',
                          },
                        },
                      }}
                    />
                  </Stack>
                </Box>
              )}
      </Container>
    </Box>
  )
}

export default AdminSales
