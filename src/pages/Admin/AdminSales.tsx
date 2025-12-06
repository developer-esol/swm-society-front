import { Box, Container, Typography, Pagination, Stack } from '@mui/material'
import { useAdminSales } from '../../hooks/admin'
import { SalesTableHeader, SalesTable } from '../../features/Admin/sales'
import { colors } from '../../theme'

const AdminSales = () => {
  const {
    transactions,
    currentPage,
    totalPages,
    searchQuery,
    fromDate,
    toDate,
    handleSearch,
    handlePageChange: handlePageChangeHook,
    handleDateFilterChange,
    handleDeleteTransaction,
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
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Sales
        </Typography>

        {/* Search and Filter Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'flex-start' }}>
          <SalesTableHeader searchQuery={searchQuery} onSearch={handleSearch} />

          {/* Date Range Inputs - Aligned with Search Bar */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', pt: 0.5 }}>
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
          onDelete={handleDeleteTransaction}
        />

        {/* Pagination and Info */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, transactions.length)} of {transactions.length} transactions
            </Typography>
            <Stack spacing={2} direction="row">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_e, page) => handlePageChange(page)}
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
